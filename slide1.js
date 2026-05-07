/* =========================================================
   SLIDE 1 — Q1'25 → Q1'26 growth (REAL DATA, 3 active accounts)
   ----------------------------------------------------------
   - Two chart modes: total revenue bars OR per-account lines
   - 3 KPI cards, all clickable -> drill-down modals
   - Right-side account table with mini sparklines
   ========================================================= */
function initSlide1() {
  const D = window.DATA;
  const C = window.CHARTS;
  const chartHost = document.getElementById('s1-chart');
  const tableEl = document.getElementById('s1-table');

  const state = { view: 'revenue' /* revenue | accounts */ };

  // ---------- Formatting helpers ----------
  const fmtUSD = (n) => {
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M';
    if (n >= 1e3) return '$' + Math.round(n / 1e3) + 'K';
    return '$' + Math.round(n);
  };
  const fmtPct = (n, withSign = true) => {
    const sign = n > 0 && withSign ? '+' : '';
    return sign + n.toFixed(n >= 100 || n <= -100 ? 0 : 1) + '%';
  };

  // ---------- Chart: revenue bars ----------
  function renderRevenueBars(svg, padL, padR, padT, padB, cw, ch, W, H) {
    const values = D.quarters.map(q => q.revenueRaw);
    const max = Math.max(...values) * 1.18;
    const slot = cw / D.quarters.length;
    const barW = slot * 0.5;

    // gridlines + y labels
    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const y = padT + (ch * i / ticks);
      const v = max * (1 - i / ticks);
      C.el('line', { x1: padL, x2: padL + cw, y1: y, y2: y, stroke: '#ededed', 'stroke-dasharray': '2 3' }, svg);
      const t = C.el('text', { x: padL - 10, y: y + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#888' }, svg);
      t.textContent = fmtUSD(v);
    }

    // separator line between actuals and forecast
    const actualCount = D.ACTUAL_COUNT || values.length;
    if (actualCount < D.quarters.length) {
      const sepX = padL + slot * actualCount;
      C.el('line', { x1: sepX, x2: sepX, y1: padT + 10, y2: padT + ch,
        stroke: '#cfd6e0', 'stroke-dasharray': '4 4', 'stroke-width': 1.2 }, svg);
    }

    D.quarters.forEach((q, i) => {
      const x = padL + slot * i + (slot - barW) / 2;
      const h = (q.revenueRaw / max) * ch;
      const y = padT + ch - h;
      const isForecast = q.isForecast;
      const isLatestActual = i === actualCount - 1;
      // Actuals: deep blue; latest actual: brand blue; forecast: light blue
      const fill = isForecast ? '#9fc0f3' : (isLatestActual ? 'var(--blue-50)' : 'var(--blue-50)');
      const opacity = isForecast ? 0.85 : 1;

      const rect = C.el('rect', { x, y, width: barW, height: h, rx: 6, ry: 6,
        fill, opacity, class: 'hot' }, svg);
      rect.addEventListener('mouseenter', (e) => {
        const prev = i > 0 ? values[i - 1] : null;
        const qoq = prev ? ((q.revenueRaw - prev) / prev) * 100 : null;
        const vsStart = i === 0 ? null : ((q.revenueRaw - values[0]) / values[0]) * 100;
        C.tipFromMouse(e, `
          <div class="t-label">${q.q} · ${isForecast ? 'Forecast' : 'Total revenue'}</div>
          <div class="t-value">${fmtUSD(q.revenueRaw)}</div>
          ${qoq !== null ? `<div class="t-row">QoQ: <b>${fmtPct(qoq)}</b></div>` : ''}
          ${vsStart !== null ? `<div class="t-row">vs Q1'25: <b>${fmtPct(vsStart)}</b></div>` : ''}
        `);
      });
      rect.addEventListener('mousemove', (e) => C.tipFromMouse(e, document.getElementById('tooltip').innerHTML));
      rect.addEventListener('mouseleave', () => C.hideTip());
      rect.addEventListener('click', () => openQuarterModal(q.q, i));

      // top label
      const vLabel = C.el('text', {
        x: x + barW / 2, y: y - 10, 'text-anchor': 'middle',
        'font-size': 13, 'font-weight': 600,
        fill: isForecast ? '#3a7bd5' : '#0f0f0f'
      }, svg);
      vLabel.textContent = fmtUSD(q.revenueRaw);

      // x label
      const qLabel = C.el('text', {
        x: x + barW / 2, y: padT + ch + 22, 'text-anchor': 'middle',
        'font-size': 12, 'font-weight': isForecast ? 500 : 500,
        fill: isForecast ? '#7a8597' : '#444'
      }, svg);
      qLabel.textContent = q.q;
    });

    // trend pill — actuals only
    const first = values[0], last = values[actualCount - 1];
    const growth = ((last - first) / first * 100).toFixed(0);
    let pill = chartHost.querySelector('.s1-trend-pill');
    if (!pill) {
      pill = document.createElement('div');
      pill.className = 's1-trend-pill';
      pill.style.cssText = 'position:absolute; top:8px; left:8px; background:#e9f3ff; color:#004dc9; padding:6px 14px; border-radius:14px; font-size:12px; font-weight:600; pointer-events:none; letter-spacing:0.2px;';
      chartHost.appendChild(pill);
    }
    pill.textContent = `Q1'25 → Q1'26 actuals: +${growth}%`;
    pill.style.display = '';

    // Actual/Forecast swatch legend (top-right)
    let lg = chartHost.querySelector('.s1-fc-legend');
    if (!lg) {
      lg = document.createElement('div');
      lg.className = 's1-fc-legend';
      lg.style.cssText = 'position:absolute; top:8px; right:8px; display:flex; gap:14px; font-size:11px; color:#444; pointer-events:none;';
      chartHost.appendChild(lg);
    }
    lg.innerHTML = `
      <span style="display:inline-flex; align-items:center; gap:6px;"><span style="display:inline-block; width:10px; height:10px; background:var(--blue-50); border-radius:2px;"></span>Actual</span>
      <span style="display:inline-flex; align-items:center; gap:6px;"><span style="display:inline-block; width:10px; height:10px; background:#9fc0f3; border-radius:2px;"></span>Forecast</span>
    `;
    lg.style.display = '';
  }

  // ---------- Chart: per-account lines ----------
  function renderAccountLines(svg, padL, padR, padT, padB, cw, ch, W, H) {
    const allValues = D.accountSeries.flatMap(a => a.values);
    const max = Math.max(...allValues) * 1.15;
    const slot = cw / (D.qLabels.length - 1 || 1);

    // gridlines + y labels
    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const y = padT + (ch * i / ticks);
      const v = max * (1 - i / ticks);
      C.el('line', { x1: padL, x2: padL + cw, y1: y, y2: y, stroke: '#ededed', 'stroke-dasharray': '2 3' }, svg);
      const t = C.el('text', { x: padL - 10, y: y + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#888' }, svg);
      t.textContent = fmtUSD(v);
    }

    // x-axis labels
    D.qLabels.forEach((q, i) => {
      const x = padL + slot * i;
      const t = C.el('text', {
        x, y: padT + ch + 22, 'text-anchor': 'middle',
        'font-size': 12, 'font-weight': 500, fill: '#444'
      }, svg);
      t.textContent = q;
    });

    // For each account, draw a polyline + dots
    // Pre-compute each account's points so we can detect overlap and offset labels
    const seriesPts = D.accountSeries.map(acct => acct.values.map((v, i) => ({
      x: padL + slot * i,
      y: padT + ch - (v / max) * ch,
      v
    })));

    D.accountSeries.forEach((acct, ai) => {
      const pts = seriesPts[ai];
      const actualCount = D.ACTUAL_COUNT || pts.length;

      // Solid line for actuals (indices 0..actualCount-1)
      if (actualCount >= 2) {
        const actualPts = pts.slice(0, actualCount);
        const pathA = actualPts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ' ' + p.y).join(' ');
        C.el('path', {
          d: pathA, fill: 'none', stroke: acct.color, 'stroke-width': 2.5,
          'stroke-linecap': 'round', 'stroke-linejoin': 'round'
        }, svg);
      }
      // Dashed line for forecast (last actual → forecast points)
      if (actualCount < pts.length) {
        const fcPts = pts.slice(Math.max(0, actualCount - 1));
        const pathF = fcPts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ' ' + p.y).join(' ');
        C.el('path', {
          d: pathF, fill: 'none', stroke: acct.color, 'stroke-width': 2.5,
          'stroke-linecap': 'round', 'stroke-linejoin': 'round',
          'stroke-dasharray': '5 4', opacity: 0.7
        }, svg);
      }

      // dots + value labels + tooltips
      pts.forEach((p, i) => {
        if (acct.values[i] === 0) return; // skip zero (BlackRock pre-onboard)
        const isForecast = i >= actualCount;
        const dot = C.el('circle', {
          cx: p.x, cy: p.y, r: 5, fill: isForecast ? '#fff' : '#fff',
          stroke: acct.color, 'stroke-width': 2.5,
          'stroke-dasharray': isForecast ? '2 2' : '',
          opacity: isForecast ? 0.85 : 1,
          class: 'hot'
        }, svg);
        dot.addEventListener('mouseenter', (e) => {
          const prev = i > 0 ? acct.values[i - 1] : null;
          const qoq = prev > 0 ? ((p.v - prev) / prev) * 100 : null;
          C.tipFromMouse(e, `
            <div class="t-label">${acct.short} · ${D.qLabels[i]}${isForecast ? ' (forecast)' : ''}</div>
            <div class="t-value">${fmtUSD(p.v)}</div>
            ${qoq !== null ? `<div class="t-row">QoQ: <b>${fmtPct(qoq)}</b></div>` : ''}
          `);
          dot.setAttribute('r', 7);
        });
        dot.addEventListener('mousemove', (e) => C.tipFromMouse(e, document.getElementById('tooltip').innerHTML));
        dot.addEventListener('mouseleave', () => { C.hideTip(); dot.setAttribute('r', 5); });
        dot.addEventListener('click', () => openAccountModal(acct));

        // Value label — place above dot by default; flip below if another series'
        // dot at same quarter is within 22px above (overlap risk)
        let labelY = p.y - 12;
        let anchor = 'middle';
        let labelX = p.x;
        const conflictAbove = seriesPts.some((other, oi) =>
          oi !== ai && other[i] && Math.abs(other[i].y - (p.y - 12)) < 18 && other[i].y < p.y
        );
        if (conflictAbove) labelY = p.y + 18;

        // Last point: place to the right so it doesn't crowd the right edge
        if (i === pts.length - 1) {
          labelX = p.x + 10;
          labelY = p.y + 4;
          anchor = 'start';
        }

        const lbl = C.el('text', {
          x: labelX, y: labelY, 'text-anchor': anchor,
          'font-size': 11, 'font-weight': 600, fill: acct.color,
          'paint-order': 'stroke', stroke: '#fff', 'stroke-width': 3, 'stroke-linejoin': 'round'
        }, svg);
        lbl.textContent = fmtUSD(p.v);
      });
    });

    // hide bar trend pill + forecast legend in line mode
    const pill = chartHost.querySelector('.s1-trend-pill');
    if (pill) pill.style.display = 'none';
    const fcLg = chartHost.querySelector('.s1-fc-legend');
    if (fcLg) fcLg.style.display = 'none';

    // forecast separator vertical guide
    const actualCount = D.ACTUAL_COUNT || D.qLabels.length;
    if (actualCount < D.qLabels.length) {
      const sepX = padL + slot * (actualCount - 0.5);
      C.el('line', { x1: sepX, x2: sepX, y1: padT + 10, y2: padT + ch,
        stroke: '#cfd6e0', 'stroke-dasharray': '4 4', 'stroke-width': 1.2 }, svg);
    }

    // ----- Legend (HTML overlay, top-center of chart) -----
    let legend = chartHost.querySelector('.s1-legend');
    if (!legend) {
      legend = document.createElement('div');
      legend.className = 's1-legend';
      chartHost.appendChild(legend);
    }
    legend.innerHTML = D.accountSeries.map(a => `
      <span class="s1-legend-item">
        <span class="s1-legend-swatch" style="background:${a.color}"></span>
        <span>${a.short}</span>
      </span>
    `).join('');
    legend.style.display = '';
  }

  // ---------- Master chart render ----------
  function renderChart() {
    const W = 1000, H = 420;
    chartHost.innerHTML = ''; // clear
    const svg = C.makeSvg(chartHost, W, H, true);
    const padL = 64, padR = state.view === 'accounts' ? 70 : 56, padT = 36, padB = 50;
    const cw = W - padL - padR, ch = H - padT - padB;

    if (state.view === 'revenue') {
      // hide legend in revenue mode
      const legend = chartHost.querySelector('.s1-legend');
      if (legend) legend.remove();
      renderRevenueBars(svg, padL, padR, padT, padB, cw, ch, W, H);
    } else {
      renderAccountLines(svg, padL, padR, padT, padB, cw, ch, W, H);
    }
  }

  // ---------- Sparkline (inline svg, used in table) ----------
  function sparkline(values, color) {
    const w = 80, h = 22, pad = 2;
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const range = max - min || 1;
    const slot = (w - pad * 2) / (values.length - 1);
    const pts = values.map((v, i) => {
      const x = pad + slot * i;
      const y = pad + (h - pad * 2) * (1 - (v - min) / range);
      return [x, y];
    });
    const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ' ' + p[1]).join(' ');
    const lastDot = pts[pts.length - 1];
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" class="spark">
      <path d="${path}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${lastDot[0]}" cy="${lastDot[1]}" r="2.4" fill="${color}"/>
    </svg>`;
  }

  // ---------- Right panel table ----------
  function renderTable() {
    const rows = D.q1_26_by_account;
    const total = D.quarters[D.quarters.length - 1].revenueRaw;

    document.getElementById('s1-table-title').textContent = 'Q1\u201926 — by account';
    document.getElementById('s1-table-sub').textContent =
      `${rows.length} active accounts · ${fmtUSD(total)} revenue`;

    let html = `<thead><tr>
      <th>Account</th>
      <th class="num">Q1'26</th>
      <th class="num">Share</th>
      <th class="num">QoQ</th>
      <th>5Q trend</th>
    </tr></thead><tbody>`;
    rows.forEach((r, i) => {
      const qoqClass = r.qoqPct >= 0 ? 'up' : 'down';
      const qoqStr = fmtPct(r.qoqPct);
      html += `<tr data-i="${i}">
        <td><b>${r.short}</b></td>
        <td class="num">${fmtUSD(r.revenueRaw)}</td>
        <td class="num">${r.share.toFixed(0)}%</td>
        <td class="num delta ${qoqClass}">${qoqStr}</td>
        <td>${sparkline(r.spark, r.color)}</td>
      </tr>`;
    });
    html += '</tbody>';
    tableEl.innerHTML = html;

    tableEl.querySelectorAll('tbody tr').forEach(tr => {
      tr.addEventListener('click', () => openAccountModal(rows[+tr.dataset.i]));
      tr.style.cursor = 'pointer';
    });
  }

  // ---------- Modals ----------
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
  function closeModal() {
    modalBackdrop.hidden = true;
    document.body.style.overflow = '';
  }
  document.getElementById('modal-close').addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  function openRevenueModal() {
    const rows = D.quarters.map((q, i) => {
      const prev = i > 0 ? D.quarters[i - 1].revenueRaw : null;
      const qoq = prev ? ((q.revenueRaw - prev) / prev) * 100 : null;
      const vsStart = i === 0 ? 0 : ((q.revenueRaw - D.quarters[0].revenueRaw) / D.quarters[0].revenueRaw) * 100;
      return `<tr>
        <td><b>${q.q}</b></td>
        <td class="num">${fmtUSD(q.revenueRaw)}</td>
        <td class="num">${qoq === null ? '—' : '<span class="delta up">' + fmtPct(qoq) + '</span>'}</td>
        <td class="num">${i === 0 ? '—' : '<span class="delta up">' + fmtPct(vsStart) + '</span>'}</td>
      </tr>`;
    }).join('');
    openModal({
      eyebrow: 'Drill-down · Revenue',
      title: 'Revenue · Q1\u201925 → Q1\u201926',
      html: `
        <p class="modal-lead">Total revenue grew from <b>$378K</b> to <b>$1.78M</b> across five quarters — a <b>+371%</b> ramp on a widening 3-account base.</p>
        <table class="dtable modal-table">
          <thead><tr>
            <th>Quarter</th>
            <th class="num">Revenue</th>
            <th class="num">QoQ</th>
            <th class="num">vs Q1'25</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `
    });
  }

  function openAccountsModal() {
    const onboardQ = (vals) => {
      const i = vals.findIndex(v => v > 0);
      return i >= 0 ? D.qLabels[i] : '—';
    };
    const rows = D.accountSeries.map(a => {
      const lastIdx = a.values.length - 1;
      const cur = a.values[lastIdx];
      const tot = a.values.reduce((s, v) => s + v, 0);
      return `<tr>
        <td><b>${a.name}</b></td>
        <td>${onboardQ(a.values)}</td>
        <td class="num">${fmtUSD(cur)}</td>
        <td class="num">${fmtUSD(tot)}</td>
      </tr>`;
    }).join('');
    openModal({
      eyebrow: 'Drill-down · Accounts',
      title: 'Active accounts',
      html: `
        <p class="modal-lead">Three active accounts as of Q1\u201926. BlackRock onboarded in Q3\u201925 and is in early ramp.</p>
        <table class="dtable modal-table">
          <thead><tr>
            <th>Account</th>
            <th>Onboarded</th>
            <th class="num">Q1'26 revenue</th>
            <th class="num">5Q total</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `
    });
  }

  function openQoqModal() {
    const rows = D.qoqLadder.map(l => `
      <tr>
        <td><b>${l.from} → ${l.to}</b></td>
        <td class="num">${fmtUSD(l.delta)}</td>
        <td class="num"><span class="delta up">${fmtPct(l.pct)}</span></td>
      </tr>
    `).join('');
    openModal({
      eyebrow: 'Drill-down · QoQ growth',
      title: 'Quarter-over-quarter growth ladder',
      html: `
        <p class="modal-lead">Five consecutive quarters of growth. Compounding ramp from a $378K base to $1.78M in Q1\u201926.</p>
        <table class="dtable modal-table">
          <thead><tr>
            <th>Transition</th>
            <th class="num">Δ Revenue</th>
            <th class="num">QoQ %</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `
    });
  }

  function openQuarterModal(qLabel, qIdx) {
    const total = D.quarters[qIdx].revenueRaw;
    const rows = D.accountSeries
      .map(a => ({ name: a.name, v: a.values[qIdx] }))
      .filter(r => r.v !== 0)
      .sort((a, b) => b.v - a.v)
      .map(r => `<tr>
        <td><b>${r.name}</b></td>
        <td class="num">${fmtUSD(r.v)}</td>
        <td class="num">${(r.v / total * 100).toFixed(0)}%</td>
      </tr>`).join('');
    openModal({
      eyebrow: `Drill-down · ${qLabel}`,
      title: `${qLabel} — by account`,
      html: `
        <p class="modal-lead">${qLabel} total: <b>${fmtUSD(total)}</b> across ${D.quarters[qIdx].accounts} active account${D.quarters[qIdx].accounts === 1 ? '' : 's'}.</p>
        <table class="dtable modal-table">
          <thead><tr>
            <th>Account</th>
            <th class="num">Revenue</th>
            <th class="num">Share</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `
    });
  }

  function openAccountModal(acct) {
    const name = acct.name || acct.short;
    const series = acct.spark || acct.values;
    const rows = D.qLabels.map((q, i) => {
      const cur = series[i];
      const prev = i > 0 ? series[i - 1] : null;
      const qoq = prev > 0 ? ((cur - prev) / prev) * 100 : null;
      return `<tr>
        <td><b>${q}</b></td>
        <td class="num">${fmtUSD(cur)}</td>
        <td class="num">${qoq === null ? '—' : '<span class="delta ' + (qoq >= 0 ? 'up' : 'down') + '">' + fmtPct(qoq) + '</span>'}</td>
      </tr>`;
    }).join('');
    const total = series.reduce((s, v) => s + v, 0);
    openModal({
      eyebrow: 'Drill-down · Account',
      title: name,
      html: `
        <p class="modal-lead">5-quarter trajectory · cumulative revenue <b>${fmtUSD(total)}</b>.</p>
        <table class="dtable modal-table">
          <thead><tr>
            <th>Quarter</th>
            <th class="num">Revenue</th>
            <th class="num">QoQ</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `
    });
  }

  // ---------- Wire up ----------
  document.querySelectorAll('[data-seg="s1-view"] button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-seg="s1-view"] button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.view = btn.dataset.view;
      renderChart();
    });
  });

  document.querySelectorAll('.kpi[data-kpi]').forEach(kpi => {
    kpi.addEventListener('click', () => {
      const k = kpi.dataset.kpi;
      if (k === 'revenue') openRevenueModal();
      else if (k === 'accounts') openAccountsModal();
      else if (k === 'qoq') openQoqModal();
    });
  });

  renderChart();
  renderTable();
}
