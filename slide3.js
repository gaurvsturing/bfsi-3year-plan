/* =========================================================
   SLIDE 3 — Open pipeline funnel + deals table
   - Funnel: 4 stages, click to drill into deals
   - Right-side deals table (sorted by close), click row -> deal detail
   - 3 KPI cards: total / late-stage / weighted (clickable)
   ========================================================= */
function initSlide3() {
  const D = window.DATA;
  const C = window.CHARTS;

  /* ---------- formatters ---------- */
  const fmtK = (n) => '$' + Math.round(n / 1000).toLocaleString() + 'K';
  const fmtFullUSD = (n) => '$' + n.toLocaleString();
  const fmtDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const fmtDateShort = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  };

  const stageColor = {
    "Discovery Call":       '#cfe1f9',
    "Solutions Scoping":    '#90b6ee',
    "Proposal":             '#3a7bd5',
    "Contract Negotiation": '#1d4d9e'
  };
  const stageTextWhite = {
    "Discovery Call":       false,
    "Solutions Scoping":    false,
    "Proposal":             true,
    "Contract Negotiation": true
  };

  const funnelState = { mode: 'value', hoveredStage: null };

  /* ---------- Funnel ---------- */
  // Fixed widths per stage order (top widest -> bottom narrowest), regardless of value
  const funnelWidthRatio = [1.0, 0.78, 0.58, 0.40];

  function renderFunnel() {
    const host = document.getElementById('s3-funnel');
    const W = 580, H = 460;
    const svg = C.makeSvg(host, W, H, true);
    const padT = 18, padB = 18, padL = 138, padR = 145;
    const ch = H - padT - padB;
    const stages = D.pipeline_stages;
    const rowH = ch / stages.length;

    const usable = W - padL - padR;

    stages.forEach((s, i) => {
      const w = funnelWidthRatio[i] * usable;
      const x = padL + (usable - w) / 2;
      const y = padT + i * rowH + 4;
      const h = rowH - 8;
      const taper = 14;
      const points = [
        [x, y],
        [x + w, y],
        [x + w - taper, y + h],
        [x + taper, y + h]
      ].map(p => p.join(',')).join(' ');

      const dim = funnelState.hoveredStage && funnelState.hoveredStage !== s.stage;
      const poly = C.el('polygon', {
        points,
        fill: stageColor[s.stage],
        class: 'hot',
        'fill-opacity': dim ? 0.32 : 1
      }, svg);

      poly.addEventListener('mouseenter', (e) => {
        funnelState.hoveredStage = s.stage;
        renderFunnel();
        C.tipFromMouse(e, `
          <div class="t-label">${s.stage} · ${s.prob}% prob</div>
          <div class="t-value">${fmtK(s.value)} open</div>
          <div class="t-row">${s.count} ${s.count === 1 ? 'deal' : 'deals'}</div>
          <div class="t-row">Weighted: <b>${fmtK(s.weighted)}</b></div>
        `);
      });
      poly.addEventListener('mousemove', (e) => C.tipFromMouse(e, document.getElementById('tooltip').innerHTML));
      poly.addEventListener('mouseleave', () => {
        funnelState.hoveredStage = null;
        renderFunnel();
        C.hideTip();
      });
      poly.addEventListener('click', () => openStageModal(s));

      // Stage label (left)
      const sl = C.el('text', {
        x: x - 14, y: y + h/2 + 1, 'text-anchor': 'end',
        'font-size': 13, 'font-weight': 600, fill: '#0f0f0f'
      }, svg);
      sl.textContent = s.stage;

      // Sub: TCV total (replaces probability subline)
      const ps = C.el('text', {
        x: x - 14, y: y + h/2 + 18, 'text-anchor': 'end',
        'font-size': 11, fill: '#888'
      }, svg);
      ps.textContent = fmtK(s.value) + ' TCV';

      // Center value
      const vl = C.el('text', {
        x: x + w/2, y: y + h/2 + 5, 'text-anchor': 'middle',
        'font-size': 15, 'font-weight': 700,
        fill: stageTextWhite[s.stage] ? '#fff' : '#0f0f0f'
      }, svg);
      vl.textContent = funnelState.mode === 'value' ? fmtK(s.value) : `${s.count} ${s.count === 1 ? 'deal' : 'deals'}`;

      // Right primary
      const rl = C.el('text', {
        x: x + w + 14, y: y + h/2 + 1, 'text-anchor': 'start',
        'font-size': 12, 'font-weight': 600, fill: '#444'
      }, svg);
      rl.textContent = funnelState.mode === 'value'
        ? `${s.count} ${s.count === 1 ? 'deal' : 'deals'}`
        : fmtK(s.value);

      // Right secondary
      const rl2 = C.el('text', {
        x: x + w + 14, y: y + h/2 + 18, 'text-anchor': 'start',
        'font-size': 10, fill: '#888'
      }, svg);
      rl2.textContent = `${fmtK(s.weighted)} weighted`;
    });
  }

  /* ---------- Deals table ---------- */
  function renderDealsTable() {
    const tbl = document.getElementById('s3-deals');
    if (!tbl) return;
    const rows = [...D.pipeline].sort((a, b) => new Date(a.close) - new Date(b.close));

    const stripPrefix = (opp, account) => {
      if (opp.startsWith(account + ' - ')) return opp.slice(account.length + 3);
      if (opp.startsWith(account + ' ')) return opp.slice(account.length + 1);
      return opp;
    };

    let html = `
      <thead>
        <tr>
          <th>Account</th>
          <th>Opportunity</th>
          <th>Stage</th>
          <th class="num">Close</th>
          <th class="num">TCV</th>
          <th class="num">Weighted</th>
        </tr>
      </thead>
      <tbody>
    `;
    rows.forEach((d) => {
      const idx = D.pipeline.indexOf(d);
      const c = stageColor[d.stage];
      const isLight = d.stage === "Discovery Call" || d.stage === "Solutions Scoping";
      html += `
        <tr data-idx="${idx}">
          <td><b>${d.account}</b></td>
          <td class="muted">${stripPrefix(d.opp, d.account)}</td>
          <td><span class="stage-pill" style="--sc:${c}; color:${isLight ? '#0f0f0f' : c};">${d.stage}</span></td>
          <td class="num">${fmtDateShort(d.close)}</td>
          <td class="num"><b>${fmtK(d.tcv)}</b></td>
          <td class="num muted">${fmtK(d.weighted)}</td>
        </tr>
      `;
    });
    html += '</tbody>';
    tbl.innerHTML = html;

    tbl.querySelectorAll('tbody tr').forEach(tr => {
      tr.addEventListener('click', () => {
        const d = D.pipeline[+tr.dataset.idx];
        openDealModal(d);
      });
    });
  }

  /* ---------- Modals (reuse global #modal-backdrop) ---------- */
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalEyebrow  = document.getElementById('modal-eyebrow');
  const modalTitle    = document.getElementById('modal-title');
  const modalBody     = document.getElementById('modal-body');

  function openModal({ eyebrow, title, html }) {
    modalEyebrow.textContent = eyebrow;
    modalTitle.textContent = title;
    modalBody.innerHTML = html;
    modalBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function openStageModal(stage) {
    const dealsHtml = stage.deals.map(d => `
      <tr>
        <td><b>${d.account}</b></td>
        <td class="muted">${d.opp}</td>
        <td class="num">${fmtDateShort(d.close)}</td>
        <td class="num"><b>${fmtK(d.tcv)}</b></td>
        <td class="num muted">${fmtK(d.weighted)}</td>
      </tr>
    `).join('');
    openModal({
      eyebrow: `Drill-down · ${stage.stage}`,
      title: `${stage.stage} — ${stage.count} ${stage.count === 1 ? 'deal' : 'deals'}`,
      html: `
        <p class="modal-lead">Open value <b>${fmtK(stage.value)}</b>. At ${stage.prob}% probability, this stage contributes <b>${fmtK(stage.weighted)}</b> to the weighted pipeline.</p>
        <table class="dtable modal-table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Opportunity</th>
              <th class="num">Close</th>
              <th class="num">TCV</th>
              <th class="num">Weighted</th>
            </tr>
          </thead>
          <tbody>${dealsHtml}</tbody>
        </table>
      `
    });
  }

  function openDealModal(d) {
    const created = fmtDate(d.created);
    const close = fmtDate(d.close);
    const dur = d.months ? `${d.months} months` : '—';
    openModal({
      eyebrow: `${d.stage} · ${d.prob}% probability`,
      title: d.account,
      html: `
        <p class="modal-lead">${d.opp}</p>
        <table class="dtable modal-table mt-16">
          <tbody>
            <tr><td class="muted">Total contract value</td><td class="num"><b>${fmtFullUSD(d.tcv)}</b></td></tr>
            <tr><td class="muted">Probability-weighted</td><td class="num">${fmtFullUSD(d.weighted)}</td></tr>
            <tr><td class="muted">Project duration</td><td class="num">${dur}</td></tr>
            <tr><td class="muted">Owner</td><td class="num">Amar Duggal</td></tr>
            <tr><td class="muted">Created</td><td class="num">${created}</td></tr>
            <tr><td class="muted">Expected close</td><td class="num">${close}</td></tr>
          </tbody>
        </table>
      `
    });
  }

  /* ---------- KPI clicks ---------- */
  document.querySelectorAll('#page-3 .kpi').forEach((kpi, i) => {
    kpi.style.cursor = 'pointer';
    kpi.addEventListener('click', () => {
      if (i === 0) openTotalModal();
      else if (i === 1) openLateStageModal();
      else if (i === 2) openWeightedModal();
      else if (i === 3) openConcentrationModal();
    });
  });

  function openTotalModal() {
    const rows = D.pipeline_stages.map(s => `
      <tr>
        <td><b>${s.stage}</b></td>
        <td class="num">${s.count}</td>
        <td class="num">${s.prob}%</td>
        <td class="num"><b>${fmtK(s.value)}</b></td>
        <td class="num muted">${fmtK(s.weighted)}</td>
      </tr>
    `).join('');
    openModal({
      eyebrow: 'Drill-down · Open pipeline',
      title: 'Open pipeline by stage',
      html: `
        <p class="modal-lead">All 11 BFSI deals total <b>${fmtK(D.pipeline_total)}</b> in open value, weighted to <b>${fmtK(D.pipeline_weighted)}</b> on standard stage probabilities.</p>
        <table class="dtable modal-table">
          <thead>
            <tr><th>Stage</th><th class="num">Deals</th><th class="num">Prob</th><th class="num">TCV</th><th class="num">Weighted</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `
    });
  }

  function openLateStageModal() {
    const late = D.pipeline.filter(d => d.stage === "Contract Negotiation");
    const rows = late.map(d => `
      <tr>
        <td><b>${d.account}</b></td>
        <td class="muted">${d.opp}</td>
        <td class="num">${fmtDateShort(d.close)}</td>
        <td class="num"><b>${fmtK(d.tcv)}</b></td>
        <td class="num muted">${fmtK(d.weighted)}</td>
      </tr>
    `).join('');
    openModal({
      eyebrow: 'Drill-down · Late stage',
      title: 'Contract Negotiation — 2 deals',
      html: `
        <p class="modal-lead">Both late-stage deals are at BlackRock — <b>${fmtK(D.pipeline_late_stage)}</b> total, expected to close in Q2/Q3'26.</p>
        <table class="dtable modal-table">
          <thead>
            <tr><th>Account</th><th>Opportunity</th><th class="num">Close</th><th class="num">TCV</th><th class="num">Weighted</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `
    });
  }

  function openWeightedModal() {
    const rows = D.pipeline_stages.map(s => `
      <tr>
        <td><b>${s.stage}</b></td>
        <td class="num">${s.count}</td>
        <td class="num">${fmtK(s.value)}</td>
        <td class="num">× ${s.prob}%</td>
        <td class="num"><b>${fmtK(s.weighted)}</b></td>
      </tr>
    `).join('');
    openModal({
      eyebrow: 'Drill-down · Weighted pipeline',
      title: 'Probability-weighted math',
      html: `
        <p class="modal-lead">Weighted pipeline <b>${fmtK(D.pipeline_weighted)}</b> = Σ (TCV × stage probability). Standard SaaS weighting: Discovery 10%, Scoping 25%, Proposal 50%, Negotiation 75%.</p>
        <table class="dtable modal-table">
          <thead>
            <tr><th>Stage</th><th class="num">Deals</th><th class="num">TCV</th><th class="num">Prob</th><th class="num">Weighted</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `
    });
  }

  function openConcentrationModal() {
    // Group by account
    const byAcct = {};
    D.pipeline.forEach(d => {
      if (!byAcct[d.account]) byAcct[d.account] = { count: 0, value: 0, weighted: 0 };
      byAcct[d.account].count += 1;
      byAcct[d.account].value += d.tcv;
      byAcct[d.account].weighted += d.weighted;
    });
    const sorted = Object.entries(byAcct).sort((a, b) => b[1].value - a[1].value);
    const rows = sorted.map(([acct, v]) => `
      <tr>
        <td><b>${acct}</b></td>
        <td class="num">${v.count}</td>
        <td class="num"><b>${fmtK(v.value)}</b></td>
        <td class="num">${(v.value / D.pipeline_total * 100).toFixed(0)}%</td>
        <td class="num muted">${fmtK(v.weighted)}</td>
      </tr>
    `).join('');
    openModal({
      eyebrow: 'Drill-down · Concentration',
      title: 'Pipeline by account',
      html: `
        <p class="modal-lead">BlackRock and Goldman Sachs together account for <b>58%</b> of open pipeline value (<b>${fmtK(1950000)}</b> of $3.35M). Diversifying remains a Q2 priority.</p>
        <table class="dtable modal-table">
          <thead>
            <tr><th>Account</th><th class="num">Deals</th><th class="num">TCV</th><th class="num">Share</th><th class="num">Weighted</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `
    });
  }

  /* ---------- Wire up ---------- */
  document.querySelectorAll('[data-seg="s3-funnel-mode"] button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-seg="s3-funnel-mode"] button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      funnelState.mode = btn.dataset.mode;
      renderFunnel();
    });
  });

  renderFunnel();
  renderDealsTable();
}
