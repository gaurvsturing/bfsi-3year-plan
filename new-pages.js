/* ============================================
   Pages 2-7: data + click-to-expand drawer
   ============================================ */

// ---------- Page 3 — Live Deployments ----------
const LIVE_DEPLOYMENTS = [
  {
    anchor: 'Apollo',
    meta: 'PE / Alts · $1T AUM',
    sub: '$5.9M run-rate · 3 use cases live',
    cases: [
      { num: '01', title: 'Fund-Controller', desc: 'Automated controls + close', tag: 'Production · Q3\'25', detail: 'AI-driven fund accounting controls and close-cycle automation. Reduces month-end close from 12 days to 5; 200+ control points monitored continuously across Apollo\'s $1T AUM book.' },
      { num: '02', title: 'SDK',              desc: 'Reusable AI building blocks', tag: 'Production · Q4\'25', detail: 'Internal SDK exposing reusable AI primitives — embeddings, retrieval, agent orchestration. Adopted by 6 internal teams; reduces time-to-pilot for net-new use cases by 70%.' },
      { num: '03', title: 'CPMI',             desc: 'Capital portfolio mgmt intelligence', tag: 'Production · Q1\'26', detail: 'Capital portfolio management intelligence layer — aggregates fund-level signals into actionable insights for the CIO office. Flagship for Athene Insurance + Atlas SP roll-out.' },
    ]
  },
  {
    anchor: 'BlackRock',
    meta: 'AM · $13.9T AUM',
    sub: '$1.2M run-rate · 4 use cases live',
    cases: [
      { num: '01', title: 'Intelligent Servicing Platform', desc: 'Client servicing automation', tag: 'Production · Q4\'25', detail: 'Agentic platform for client servicing — handles inbound queries, exception handling, and escalations across BlackRock\'s wealth + institutional book. Live with first cohort of advisors.' },
      { num: '02', title: 'Trades Reconciliation',          desc: 'Real-time trade matching', tag: 'Production · Q4\'25', detail: 'Real-time trade reconciliation across Aladdin and 30+ counterparty venues. Brings T+0 reconciliation to a process that was previously T+2.' },
      { num: '03', title: 'Aladdin Onboarding',             desc: 'Accelerated client setup', tag: 'Production · Q1\'26', detail: 'AI-accelerated Aladdin onboarding — reduces 12-week onboarding to 4 weeks for new institutional clients. First wedge into Aladdin agentic copilots expansion.' },
      { num: '04', title: 'Books & Records',                desc: 'Ledger automation', tag: 'Production · Q1\'26', detail: 'AI-powered books-and-records / ledger automation. Foundation for the eFront-for-alts expansion (Apollo playbook applied to BlackRock\'s alternatives platform).' },
    ]
  },
  {
    anchor: 'Goldman Sachs',
    meta: 'IB · $3.6T AUM',
    sub: '$0.4M run-rate · 1 use case live',
    cases: [
      { num: '01', title: 'GS AI', desc: 'Enterprise AI platform — GSAM, Legend, Goldman Corporate', tag: 'Production · Q1\'26', detail: 'Foothold in Goldman\'s enterprise AI platform — initial scope across GSAM, Legend, and Goldman Corporate. Beachhead for GSAM portfolio research agents + Mosaic deal analytics platform expansion.' },
    ]
  },
];

function buildPage3() {
  const root = document.getElementById('p3-grid');
  if (!root) return;

  LIVE_DEPLOYMENTS.forEach(group => {
    const colCount = 1 + group.cases.length;
    const row = document.createElement('div');
    row.className = `anchor-row cols-${colCount}`;

    const meta = document.createElement('div');
    meta.className = 'anchor-meta';
    meta.innerHTML = `
      <h3 class="anchor-name">${group.anchor}</h3>
      <p class="anchor-detail">${group.meta}<span class="anchor-sub">${group.sub}</span></p>
    `;
    row.appendChild(meta);

    group.cases.forEach((c) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'usecase-card';
      card.innerHTML = `
        <div class="uc-num">${c.num}</div>
        <h4 class="uc-title">${c.title}</h4>
        <p class="uc-desc">${c.desc}</p>
        <div class="uc-tag"><span class="dot"></span>${c.tag}</div>
      `;
      card.dataset.detail = c.detail;
      card.dataset.title = c.title;
      attachExpandHandler(card);
      row.appendChild(card);
    });

    root.appendChild(row);
  });
}

// ---------- Page 2 — Anchor Logos ----------
const ANCHOR_LOGOS = [
  {
    name: 'Apollo',
    signed: '$6.9M', pipeline: '$0M',
    sector: 'PE / Alts', aum: '$1T',
    vectors: [
      'Athene Insurance: Actuarial AI',
      'Atlas SP: Securitization data ops',
      'ES org-wide: Finance, ops, servicing',
    ],
    detail: 'Largest BFSI account at $6.9M signed FY26. Athene Insurance is the next big wedge — actuarial-AI is a $5M+ TAM inside the Apollo umbrella. Atlas SP and the broader Apollo ES org are the FY27 expansion vectors.'
  },
  {
    name: 'BlackRock',
    signed: '$2.7M', pipeline: '$1.10M',
    sector: 'Asset Mgmt', aum: '$13.9T',
    vectors: [
      'Aladdin agentic copilots',
      'eFront for alts (Apollo playbook)',
      'BPR ACT scale-out · Retail wealth',
    ],
    detail: '$2.7M signed + $1.10M pipeline. Three named expansion vectors. Aladdin agentic copilots is the most defensible — once embedded, every new BlackRock client onboarding becomes Jarvis-mediated.'
  },
  {
    name: 'Goldman Sachs',
    signed: '$0M', pipeline: '$0.85M',
    sector: 'Investment Bank', aum: '$3.6T',
    vectors: [
      'GSAM: Portfolio research agents',
      'Mosaic: Deal analytics platform',
      'IB pitchbook + DD automation',
    ],
    detail: 'Pipeline-only today ($0.85M). GS AI deployment is the foot-in-the-door; FY27 lands GSAM portfolio research agents + Mosaic. IB pitchbook automation is the franchise-defining win.'
  },
  {
    name: 'ADS Securities',
    signed: '$0.7M', pipeline: '$0M',
    sector: 'Sell-side', aum: 'MENA',
    vectors: [
      'Trading platform AI (RFQ, routing)',
      'Real-time risk & surveillance',
      'KYC + research agents',
    ],
    detail: '$0.7M signed. Smaller, but the only sell-side anchor — every win here is a credential we can use against Citi/Barclays/MS in FY28. Trading-platform AI is the wedge.'
  },
];

function buildPage2() {
  const root = document.getElementById('p2-grid');
  if (!root) return;

  ANCHOR_LOGOS.forEach(a => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'logo-card';
    card.innerHTML = `
      <h3 class="logo-name">${a.name}</h3>
      <div class="rev-row">
        <div class="rev-block">
          <div class="rev-lbl">Signed Revenue</div>
          <div class="rev-val">${a.signed}</div>
        </div>
        <div class="rev-block pipe">
          <div class="rev-lbl">Pipeline Revenue</div>
          <div class="rev-val">${a.pipeline}</div>
        </div>
      </div>
      <div>
        <div class="vec-title">Expansion vectors</div>
        <div class="vec-list">
          ${a.vectors.map(v => `<div class="vec-item">${v}</div>`).join('')}
        </div>
      </div>
      <div class="stats-row">
        <div class="stat-mini">
          <div class="sm-lbl">Sector</div>
          <div class="sm-val">${a.sector}</div>
        </div>
        <div class="stat-mini">
          <div class="sm-lbl">AUM</div>
          <div class="sm-val">${a.aum}</div>
        </div>
      </div>
    `;
    card.dataset.title = `${a.name} — expansion thesis`;
    card.dataset.detail = a.detail;
    attachExpandHandler(card);
    root.appendChild(card);
  });
}

// ---------- Page 4 — Pipeline → Expansion → Strategic Land ----------
const TIERS = [
  {
    num: '01',
    name: 'In pipeline now',
    detail: '$3.35M · 11 deals · Next 6 Mo',
    accounts: [
      { name: 'BlackRock',        meta: '$750K',                color: '#0f0f0f', detail: 'BlackRock BPR ACT — $750K. Late-stage pipeline (Contract Negotiation). Closes Q3\'26.' },
      { name: 'Goldman Sachs',    meta: '$850K',                color: '#a8ccf8', detail: 'Goldman GSAM portfolio research agents + Mosaic deal analytics — combined ~$850K open. Anchor for FY27 expansion.' },
      { name: 'Ghisallo',         meta: '$250K',                color: '#1d4d9e', detail: 'Ghisallo Capital — $250K. Multi-strategy hedge fund; Apollo-peer alts segment.' },
      { name: 'Khazanah',         meta: '$250K',                color: '#0f7257', detail: 'Khazanah Nasional — $250K. Sovereign wealth, Malaysia. Diversifies the geo footprint.' },
      { name: 'Condé Nast',       meta: '$500K',                color: '#0f0f0f', detail: 'Condé Nast — $500K. Adjacent (media), but anchored by a senior buyer relationship.' },
      { name: 'Neuberger Berman', meta: '$250K',                color: '#444444', detail: 'Neuberger Berman — $250K. Asset manager, Apollo-peer profile.' },
      { name: 'Bank of America',  meta: '$150K',                color: '#d24747', detail: 'Bank of America — $150K. Top-10 NA bank wedge; sell-side credential.' },
    ]
  },
  {
    num: '02',
    name: 'Apollo-peer alts + AM',
    detail: 'Land FY27 · 12–18 Mo · Jarvis-led',
    accounts: [
      { name: 'KKR',         meta: '$638B · alts',        color: '#d24747', detail: 'KKR — $638B alts. Direct Apollo peer. Use Apollo + Athene credentials to land.' },
      { name: 'Carlyle',     meta: '$447B · PE/credit',   color: '#0f7257', detail: 'Carlyle — $447B PE/credit. Apollo-peer alts. Jarvis-led entry.' },
      { name: 'Brookfield',  meta: '$1T · infra/credit',  color: '#1d4d9e', detail: 'Brookfield — $1T infra + credit. Largest peer AUM; long sales cycle, high LTV.' },
      { name: 'TPG',         meta: '$246B · alts',        color: '#1d4d9e', detail: 'TPG — $246B alts. Peer alts. Jarvis-led entry; FY27 H2.' },
      { name: 'PIMCO',       meta: '$2T · fixed inc.',    color: '#56a8f7', detail: 'PIMCO — $2T fixed income. Adjacent to alts; Jarvis fixed-income controls thesis.' },
      { name: 'TD Bank',     meta: 'Top-10 NA bank',      color: '#0f7257', detail: 'TD Bank — Top-10 NA bank. Sell-side wedge; FY27 land.' },
    ]
  },
  {
    num: '03',
    name: 'Mega-AM + sell-side',
    detail: 'FY28 strategic · Multi-year',
    accounts: [
      { name: 'Vanguard',    meta: '$10.1T AUM',     color: '#d24747', detail: 'Vanguard — $10.1T. Index-and-passive giant. Multi-year strategic; needs co-marketing rights.' },
      { name: 'Fidelity',    meta: '$5.9T · wealth', color: '#0f7257', detail: 'Fidelity — $5.9T wealth. Wealth + retirement; FY28 strategic.' },
      { name: 'State Street',meta: '$4.7T · Alpha',  color: '#1d4d9e', detail: 'State Street — $4.7T. Alpha platform; institutional services. FY28 strategic.' },
      { name: 'JPMorgan AM', meta: '$3.7T · IndexGPT', color: '#1d4d9e', detail: 'JPMorgan AM — $3.7T. IndexGPT competitive overlap; Jarvis-as-vendor pitch.' },
      { name: 'Citi',        meta: 'Markets + Wealth', color: '#1d4d9e', detail: 'Citi — Markets + Wealth. Sell-side franchise. FY28 multi-year.' },
      { name: 'Barclays',    meta: 'EU/UK markets',  color: '#56a8f7', detail: 'Barclays — EU/UK markets. EU/UK sell-side beachhead; FY28.' },
    ]
  },
];

function buildPage4() {
  const root = document.getElementById('p4-grid');
  if (!root) return;

  TIERS.forEach(t => {
    const row = document.createElement('div');
    row.className = 'tier-row';
    row.innerHTML = `
      <div class="tier-meta">
        <div class="tier-num">${t.num}</div>
        <h3 class="tier-name">${t.name}</h3>
        <p class="tier-detail">${t.detail}</p>
      </div>
      <div class="tier-cards cols-${t.accounts.length}"></div>
    `;
    const cardsWrap = row.querySelector('.tier-cards');
    t.accounts.forEach(a => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'tier-card';
      card.style.setProperty('--tc', a.color);
      card.innerHTML = `
        <h4 class="tc-name">${a.name}</h4>
        <p class="tc-meta">${a.meta}</p>
      `;
      card.dataset.title = a.name;
      card.dataset.detail = a.detail;
      attachExpandHandler(card);
      cardsWrap.appendChild(card);
    });
    root.appendChild(row);
  });
}

// ---------- Page 6 — Jarvis 3-Year Plan ----------
const PLAN = [
  {
    year: 'FY26', phase: 'Land & expand',
    revenue: '$10–12M', logos: '5',
    bullets: [
      'Convert $3.35M open pipeline',
      'Apollo + BlackRock H2 expansion',
      'Jarvis pilot in 2 anchors',
    ],
    detail: 'FY26 is about converting what we have. $3.35M open pipeline plus mature Apollo + BlackRock expansion paths. Jarvis pilots in 2 anchors prove the multiplier mechanic before FY27 productization.'
  },
  {
    year: 'FY27', phase: 'Multiply via Jarvis',
    revenue: '$30M', logos: '12',
    bullets: [
      'Jarvis embedded in 8/12 logos',
      'KKR, Carlyle, Brookfield, PIMCO land',
      'First $5M+ platform-led deal',
    ],
    detail: 'FY27 is the inflection. Jarvis embedded in 8 of 12 logos turns every land into expansion. KKR / Carlyle / Brookfield / PIMCO close as Jarvis-led — that\'s when "multiplier" becomes "moat".'
  },
  {
    year: 'FY28', phase: 'Franchise',
    revenue: '$50–60M', logos: '20+',
    bullets: [
      'Jarvis as standalone product wedge',
      'Sell-side land (Citi, Barclays, MS)',
      'BFSI = #1 vertical for TI',
    ],
    detail: 'FY28 is franchise. Jarvis sells standalone (productized). Sell-side wedges (Citi/Barclays/MS) prove BFSI is platform-defining. Vertical becomes the company\'s #1 revenue line.'
  },
];

const PILLARS = [
  { name: 'Guardrails',      desc: 'Regulator-grade policy',         detail: 'Policy enforcement layer aligned to FINRA, SEC, MiFID-II, and internal compliance. Every Jarvis call is policy-checked at runtime — non-negotiable for regulated buyers.' },
  { name: 'LLM Gateway',     desc: 'Single entry · Observability',   detail: 'Single entry point for all model traffic. Per-call observability (cost, latency, content). Required for FinOps + audit.' },
  { name: 'Model Agnostic',  desc: 'Vendor-neutral · Swap models',   detail: 'No vendor lock-in. Swap GPT/Claude/Gemini/in-house at runtime. Critical for buyers who already have model preferences.' },
  { name: 'Agent Clusters',  desc: 'Compose · Orchestrate',          detail: 'Compose multi-agent workflows from primitives. Reusable across use cases — embeddings + retrieval + tool-use + memory.' },
  { name: 'Knowledge Graph', desc: 'Institutional memory',           detail: 'Cross-use-case institutional memory. Every deployment hardens the graph; new logos benefit from it on day one.' },
  { name: 'FinOps + IAM',    desc: 'Cost + identity, day one',       detail: 'Per-team cost attribution + identity-bound access from day one. Standard procurement requirement; we ship it as default.' },
];

function buildPage6() {
  const planRoot = document.getElementById('p6-plan');
  const pillarRoot = document.getElementById('p6-pillars');
  if (!planRoot || !pillarRoot) return;

  PLAN.forEach(p => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'plan-card';
    card.innerHTML = `
      <div class="pc-head">
        <div class="pc-year">${p.year}</div>
        <div class="pc-phase">${p.phase}</div>
      </div>
      <div class="pc-stats">
        <div class="pc-stat">
          <div class="pc-lbl">Revenue</div>
          <div class="pc-val">${p.revenue}</div>
        </div>
        <div class="pc-stat">
          <div class="pc-lbl">Active Logos</div>
          <div class="pc-val">${p.logos}</div>
        </div>
      </div>
      <ul class="pc-bullets">
        ${p.bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
    `;
    card.dataset.title = `${p.year} · ${p.phase}`;
    card.dataset.detail = p.detail;
    attachExpandHandler(card);
    planRoot.appendChild(card);
  });

  PILLARS.forEach(p => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'pillar-card';
    card.innerHTML = `
      <div class="pl-head">
        <div class="pl-dot"></div>
        <div class="pl-name">${p.name}</div>
      </div>
      <p class="pl-desc">${p.desc}</p>
    `;
    card.dataset.title = `Jarvis · ${p.name}`;
    card.dataset.detail = p.detail;
    attachExpandHandler(card);
    pillarRoot.appendChild(card);
  });
}

// ---------- Page 7 — Foundation ----------
const FOUNDATION = [
  {
    num: '01 · Platform', name: 'Jarvis',
    desc: 'Productized accelerator. Built and hardened in BFSI. Reusable across every vertical we land in.',
    stats: [{ lbl: 'Pillars', val: '6' }, { lbl: 'Anchors', val: '4' }],
    detail: 'Jarvis is the IP we\'re selling everywhere next. Built in BFSI (regulator-grade, multi-model, identity-bound) — those constraints are what every other vertical also needs.'
  },
  {
    num: '02 · IP', name: 'Use Cases',
    desc: '8 production deployments. Repeatable patterns for ops, research, servicing, governance, controls.',
    stats: [{ lbl: 'Live use cases', val: '8' }, { lbl: 'Anchors', val: '3' }],
    detail: '8 live use-case patterns are the playbook. "Apollo-Athene actuarial AI" generalizes to insurance. "BlackRock servicing" generalizes to wealth. "GS Mosaic" generalizes to deal-flow industries.'
  },
  {
    num: '03 · People', name: 'Talent',
    desc: '80 engineers in field. Vertical-fluent FDEs and architects sourced via the Turing platform.',
    stats: [{ lbl: 'Engineers', val: '80' }, { lbl: 'Roles', val: '43' }],
    detail: '80 vertical-fluent engineers in field is the moat competitors can\'t buy. Sourced via Turing\'s platform — we have unfair distribution on talent supply.'
  },
];

const NEXT_VERTICALS = [
  { name: 'Healthcare & Pharma', meta: 'Regulator-grade halo',     detail: 'Healthcare & Pharma — regulator-grade, multi-model, identity-bound = same constraint set as BFSI. Highest pattern reuse.' },
  { name: 'Insurance',           meta: 'BFSI-adjacent · Athene',   detail: 'Insurance — direct halo from Apollo-Athene actuarial-AI deployment. Easiest next vertical.' },
  { name: 'Industrials',         meta: 'Ops-AI playbook',          detail: 'Industrials — operational-AI playbook (controls, ops, finance) translates directly.' },
  { name: 'Public Sector',       meta: 'Compliance-led',           detail: 'Public Sector — guardrails + compliance posture is the differentiator. Long sales cycle, high LTV.' },
  { name: 'Energy & Utilities',  meta: 'Regulated, controls-heavy',detail: 'Energy & Utilities — regulated, capital-intensive, controls-heavy. Mirror of BFSI compliance posture.' },
  { name: 'Tech & Telecom',      meta: 'Proof-of-platform',        detail: 'Tech & Telecom — opportunistic; easiest land but lowest defensibility. Use as proof-of-platform.' },
];

function buildPage7() {
  const founRoot = document.getElementById('p7-foundation');
  const nextRoot = document.getElementById('p7-next');
  if (!founRoot || !nextRoot) return;

  FOUNDATION.forEach(f => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'foundation-card';
    card.innerHTML = `
      <div class="fc-num">${f.num}</div>
      <h3 class="fc-name">${f.name}</h3>
      <p class="fc-desc">${f.desc}</p>
      <div class="fc-stats">
        ${f.stats.map(s => `
          <div class="fc-stat">
            <div class="fcs-lbl">${s.lbl}</div>
            <div class="fcs-val">${s.val}</div>
          </div>
        `).join('')}
      </div>
    `;
    card.dataset.title = `${f.num} — ${f.name}`;
    card.dataset.detail = f.detail;
    attachExpandHandler(card);
    founRoot.appendChild(card);
  });

  NEXT_VERTICALS.forEach(n => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'next-card';
    card.innerHTML = `
      <div class="nc-name">${n.name}</div>
      ${n.meta ? `<div class="nc-meta">${n.meta}</div>` : ''}
    `;
    card.dataset.title = n.name;
    card.dataset.detail = n.detail;
    attachExpandHandler(card);
    nextRoot.appendChild(card);
  });
}

// ---------- Universal click-to-expand drawer ----------
function attachExpandHandler(card) {
  card.addEventListener('click', (e) => {
    e.stopPropagation();
    const slide = card.closest('.slide');
    if (!slide) return;

    slide.querySelectorAll('.expand-drawer.is-open').forEach(d => d.classList.remove('is-open'));
    slide.querySelectorAll('.is-active').forEach(c => {
      if (c !== card) c.classList.remove('is-active');
    });

    let drawer = slide.querySelector('.expand-drawer.global');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.className = 'expand-drawer global';
      const pad = slide.querySelector('.slide-pad');
      pad.appendChild(drawer);
    }

    if (card.classList.contains('is-active')) {
      card.classList.remove('is-active');
      drawer.classList.remove('is-open');
      return;
    }

    card.classList.add('is-active');
    drawer.innerHTML = `
      <div class="ed-title">${card.dataset.title || ''}</div>
      <div class="ed-body">${card.dataset.detail || ''}</div>
    `;
    drawer.classList.add('is-open');
  });
}

// Click outside to close
document.addEventListener('click', (e) => {
  if (e.target.closest('.usecase-card, .logo-card, .tier-card, .plan-card, .pillar-card, .foundation-card, .next-card, .expand-drawer')) return;
  document.querySelectorAll('.expand-drawer.is-open').forEach(d => d.classList.remove('is-open'));
  document.querySelectorAll('.usecase-card.is-active, .logo-card.is-active, .tier-card.is-active, .plan-card.is-active, .pillar-card.is-active, .foundation-card.is-active, .next-card.is-active').forEach(c => c.classList.remove('is-active'));
});

function initNewPages() {
  buildPage2();
  buildPage3();
  buildPage4();
  buildPage6();
  buildPage7();
}
