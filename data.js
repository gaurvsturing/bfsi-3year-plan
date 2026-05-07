/* =========================================================
   BFSI deck data — placeholder figures, structured for swap-out
   ========================================================= */
window.DATA = (function () {
  // ----- Quarterly history Q1'25 → Q1'26 actuals + Q2-Q4'26 forecast -----
  // Per-account quarterly revenue in $ (raw). Indexes 0-4 = actuals, 5-7 = forecast.
  const accountSeries = [
    { name: "Apollo Global Management",   short: "Apollo",    color: "#0066ff", sparkColor: "#0066ff",
      values: [118152, 481905, 748021, 1289324, 1483287, 1809695, 1841715, 1812192] },
    { name: "ADS Securities LLC SPC",     short: "ADS",       color: "#e8943a", sparkColor: "#e8943a",
      values: [260178, 263768, 241054, 205480, 189078,   274308,  274308,  274308 ] },
    { name: "BlackRock, Inc.",            short: "BlackRock", color: "#2da55c", sparkColor: "#2da55c",
      values: [0,      0,      13728,  57096,   111784,  824728,  873440,  872816 ] }
  ];
  const qLabels = ["Q1'25", "Q2'25", "Q3'25", "Q4'25", "Q1'26", "Q2'26 F", "Q3'26 F", "Q4'26 F"];
  const ACTUAL_COUNT = 5; // first 5 quarters are actuals; remainder are forecast

  // Aggregate totals per quarter (in $M for chart display)
  const quarters = qLabels.map((q, i) => {
    const totalRaw = accountSeries.reduce((s, a) => s + a.values[i], 0);
    const activeAccounts = accountSeries.filter(a => a.values[i] > 0).length;
    return {
      q,
      revenueRaw: totalRaw,
      revenue: totalRaw / 1e6,    // $M
      accounts: activeAccounts,
      isForecast: i >= ACTUAL_COUNT
    };
  });

  // QoQ growth ladder — actuals only (Q1'25 → Q1'26)
  const actualQuarters = quarters.slice(0, ACTUAL_COUNT);
  const qoqLadder = actualQuarters.slice(1).map((q, i) => {
    const prev = actualQuarters[i].revenueRaw;
    return {
      from: actualQuarters[i].q,
      to: q.q,
      pct: ((q.revenueRaw - prev) / prev) * 100,
      delta: q.revenueRaw - prev
    };
  });

  // ----- Q1'26 by account (for right-panel table) — last ACTUAL quarter -----
  const lastIdx = ACTUAL_COUNT - 1;
  const q1_26_total = quarters[lastIdx].revenueRaw;
  const q1_26_by_account = accountSeries
    .map(a => {
      const cur = a.values[lastIdx];
      const prev = a.values[lastIdx - 1];
      const qoqPct = prev > 0 ? ((cur - prev) / prev) * 100 : (cur > 0 ? 100 : 0);
      return {
        name: a.name,
        short: a.short,
        color: a.color,
        revenueRaw: cur,
        revenueM: cur / 1e6,
        share: cur / q1_26_total * 100,
        qoqPct,
        qoqDeltaRaw: cur - prev,
        spark: a.values  // 5-quarter trajectory for sparkline
      };
    })
    .sort((a, b) => b.revenueRaw - a.revenueRaw);

  // ----- Slide 2 (Page 4): Committed CY26 — REAL data -----
  // Monthly committed by account, Jan'26 → Dec'26 (Q1 = actuals, Q2-Q4 = forecast/committed)
  const cy26_months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const cy26_account_monthly = [
    { name: "Apollo Global Management",   short: "Apollo",    color: "#0066ff",
      values: [437929, 442054, 603303, 633587.20, 604064, 604064, 633587.20, 604064, 604064, 633587.20, 515494, 663110.40] },
    { name: "BlackRock, Inc.",            short: "BlackRock", color: "#2da55c",
      values: [23400,  24336,  64048,  218904,    292880, 298704, 298704,    281856, 292880, 292880,    275408, 304528] },
    { name: "ADS Securities LLC SPC",     short: "ADS",       color: "#e8943a",
      values: [63108,  62516,  63454,  92340,     92340,  92340,  27250,     27250,  27250,  27250,     27250,  27250] }
  ];

  // Monthly totals
  const cy26_monthly_totals = cy26_months.map((_, i) =>
    cy26_account_monthly.reduce((s, a) => s + a.values[i], 0)
  );

  // Quarterly rollups (Q1 = actual, Q2-Q4 = committed forecast)
  const cy26_quarters = [
    { q: "Q1'26", type: "actual",    months: [0, 1, 2],
      total: cy26_monthly_totals.slice(0, 3).reduce((s, v) => s + v, 0),
      target: 2.08e6 },
    { q: "Q2'26", type: "committed", months: [3, 4, 5],
      total: cy26_monthly_totals.slice(3, 6).reduce((s, v) => s + v, 0),
      target: 2.53e6 },
    { q: "Q3'26", type: "committed", months: [6, 7, 8],
      total: cy26_monthly_totals.slice(6, 9).reduce((s, v) => s + v, 0),
      target: 3.13e6 },
    { q: "Q4'26", type: "committed", months: [9, 10, 11],
      total: cy26_monthly_totals.slice(9, 12).reduce((s, v) => s + v, 0),
      target: 3.48e6 }
  ];

  // 14 SOWs — Q1'26 detail (Jan/Feb/Mar)
  const cy26_sows = [
    { account: "Apollo",    name: "Apollo GenAI SOW 14 - Core AI Platform",            jan: 160734.12, feb: 160734.12, mar: 160734.12 },
    { account: "Apollo",    name: "Apollo GenAI SOW 15 - AI EMBED (Prompt Engineering)", jan: 49130.32, feb: 49130.32,  mar: 49130.32 },
    { account: "Apollo",    name: "Apollo GenAI SOW 19 - Distributed projects",        jan: 228065,    feb: 219320,    mar: 254275 },
    { account: "Apollo",    name: "Apollo GenAI SOW 20 - Client Master",               jan: 0,         feb: 12870,     mar: 31460 },
    { account: "Apollo",    name: "Apollo GenAI SOW 22 - QA",                          jan: 0,         feb: 0,         mar: 15264 },
    { account: "Apollo",    name: "Apollo GenAI SOW 23 - ES ServStream",               jan: 0,         feb: 0,         mar: 32800 },
    { account: "Apollo",    name: "Apollo GenAI SOW 24 - Es Ops",                      jan: 0,         feb: 0,         mar: 17600 },
    { account: "Apollo",    name: "Apollo GenAI SOW 25 - ES-Finance (Quickwins + eController)", jan: 0, feb: 0,        mar: 30840 },
    { account: "Apollo",    name: "Apollo GenAI SOW 26 - ACS Strategic Insights",      jan: 0,         feb: 0,         mar: 11200 },
    { account: "BlackRock", name: "BlackRock GenAI - Product Master",                  jan: 23400,     feb: 24336,     mar: 22464 },
    { account: "BlackRock", name: "BlackRock GenAI - Product Master 2",                jan: 0,         feb: 0,         mar: 17784 },
    { account: "BlackRock", name: "BlackRock GenAI SOW 3 - Intelligent Servicing Platform", jan: 0,    feb: 0,         mar: 23800 },
    { account: "ADS",       name: "SOW 1",                                              jan: 47107.72, feb: 46916,     mar: 47454.10 },
    { account: "ADS",       name: "SOW 2",                                              jan: 16000,    feb: 15600,     mar: 16000 }
  ];

  // ----- Slide 3: pipeline (11 open deals; all stages mid-funnel) -----
  // Stage probability defaults (BFSI standard SaaS weighting)
  const stageProb = {
    "Discovery Call":       10,
    "Solutions Scoping":    25,
    "Proposal":             50,
    "Contract Negotiation": 75
  };
  const stageOrder = ["Discovery Call", "Solutions Scoping", "Proposal", "Contract Negotiation"];

  const pipeline = [
    { account: "Bank of America",          opp: "Bank of America - GenAI",                          stage: "Discovery Call",       created: "2025-03-30", close: "2026-08-01", months: null, tcv: 150000 },
    { account: "BlackRock",                opp: "BlackRock GenAI - PLDC",                           stage: "Contract Negotiation", created: "2026-02-18", close: "2026-09-01", months: 9,    tcv: 350000 },
    { account: "BlackRock",                opp: "BlackRock GenAI SOW 5 - BPR ACT Implementation Acceleration",   stage: "Contract Negotiation", created: "2026-02-24", close: "2026-06-01", months: 10,   tcv: 750000 },
    { account: "Condé Nast",               opp: "Condé Nast - Taste Agent",                         stage: "Proposal",             created: "2026-05-01", close: "2026-07-31", months: 3,    tcv: 250000 },
    { account: "Condé Nast",               opp: "Condé Nast - Yield Optimization",                  stage: "Proposal",             created: "2026-05-01", close: "2026-06-30", months: 3,    tcv: 250000 },
    { account: "Ghisallo Capital Mgmt",    opp: "Ghisallo Capital Management - GenAI",              stage: "Proposal",             created: "2026-04-29", close: "2026-05-31", months: 3,    tcv: 250000 },
    { account: "Goldman Sachs",            opp: "Goldman Sachs - GenAI",                            stage: "Proposal",             created: "2026-08-10", close: "2026-09-01", months: 12,   tcv: 250000 },
    { account: "Goldman Sachs",            opp: "Goldman Sachs - GSAM",                             stage: "Discovery Call",       created: "2025-03-10", close: "2026-07-01", months: null, tcv: 300000 },
    { account: "Goldman Sachs",            opp: "Goldman Sachs - Mosaic Project",                   stage: "Solutions Scoping",    created: "2026-02-07", close: "2026-07-01", months: 12,   tcv: 300000 },
    { account: "Khazanah Nasional",        opp: "Khazanah Nasional Berhad - GenAI",                 stage: "Proposal",             created: "2026-04-29", close: "2026-05-31", months: 3,    tcv: 250000 },
    { account: "Neuberger Berman",         opp: "NB - GenAI",                                       stage: "Discovery Call",       created: "2025-09-02", close: "2026-08-31", months: null, tcv: 250000 }
  ].map(d => ({ ...d, prob: stageProb[d.stage], weighted: d.tcv * stageProb[d.stage] / 100 }));

  // Aggregate by stage (in funnel order)
  const pipeline_stages = stageOrder.map(stage => {
    const deals = pipeline.filter(d => d.stage === stage);
    return {
      stage,
      prob: stageProb[stage],
      count: deals.length,
      value: deals.reduce((s, d) => s + d.tcv, 0),
      weighted: deals.reduce((s, d) => s + d.weighted, 0),
      deals
    };
  });

  const pipeline_total = pipeline.reduce((s, d) => s + d.tcv, 0);
  const pipeline_weighted = pipeline.reduce((s, d) => s + d.weighted, 0);
  const pipeline_late_stage = pipeline.filter(d => d.stage === "Contract Negotiation").reduce((s, d) => s + d.tcv, 0);

  // ----- Slide 4: accounts -----
  const accounts = [
    { name: "Atlas Bank",        arr: 7.8, health: "amber", owner: "P. Mehta",
      risks: ["Sponsor change in Q1; new CIO scoping H2 expansion", "Negotiation slipped 2 weeks"],
      plan: "Exec QBR scheduled May 8 · re-baseline Phase 2 SOW · POC of fraud module" },
    { name: "Meridian Capital",  arr: 6.2, health: "green", owner: "S. Iyer",
      risks: ["None material"],
      plan: "Phase 2 GA on May 22 · expansion to FX desk in Q3" },
    { name: "Northwind Insurance", arr: 5.4, health: "green", owner: "J. Park",
      risks: ["None material"],
      plan: "Full rollout by Jun 12 · case study to publish in Q3" },
    { name: "Sterling Wealth",   arr: 4.1, health: "green", owner: "A. Costa",
      risks: ["EU rollout dependency on data-residency review"],
      plan: "EU residency review locked for May · APAC kickoff in June" },
    { name: "Cobalt Federal",    arr: 3.6, health: "green", owner: "R. Singh",
      risks: ["Renewal in Q2 — 95% probability"],
      plan: "Renewal paper out May 2 · upsell of audit module attached" },
    { name: "Helios Re",         arr: 3.0, health: "green", owner: "M. Tan",
      risks: ["None material"],
      plan: "Model recalibration ships May 30 · second LOB scoping" },
    { name: "Pinewood Trust",    arr: 2.4, health: "red",   owner: "L. Davies",
      risks: ["KYC vendor gap delaying go-live by 6 weeks", "Champion left in Mar"],
      plan: "Recovery plan: bridge integration in 3 weeks · new sponsor identified · weekly steerco" },
    { name: "Vanguard Heights",  arr: 2.2, health: "green", owner: "K. Brown",
      risks: ["None material"],
      plan: "Portfolio analytics live May 15 · cross-sell to risk team" },
    { name: "Crestline Capital", arr: 1.9, health: "green", owner: "S. Iyer",
      risks: ["None material"],
      plan: "Steady-state · expansion conversation in Q3" },
    { name: "Brightpath AM",     arr: 1.7, health: "green", owner: "A. Costa",
      risks: ["None material"],
      plan: "Phase 2 scoping · QBR Jun 4" },
    { name: "Foxglove Insure",   arr: 1.5, health: "amber", owner: "J. Park",
      risks: ["Adoption stalled at 38% post launch"],
      plan: "Adoption sprint May 5–30 · embedded CSM 3d/wk · success metrics review Jun 10" },
    { name: "Halcyon Wealth",    arr: 1.3, health: "green", owner: "K. Brown",
      risks: ["None material"],
      plan: "On track · renewal in Q4" },
    { name: "Onyx Securities",   arr: 1.1, health: "green", owner: "M. Tan",
      risks: ["None material"],
      plan: "Phase 1 GA on May 18" },
    { name: "Lighthouse Bank",   arr: 0.6, health: "green", owner: "R. Singh",
      risks: ["None material"],
      plan: "Pilot conversion paper out Jun 2" }
  ];

  const q2_plan = [
    { title: "Atlas Bank exec QBR + Phase 2 re-baseline",      owner: "P. Mehta",  date: "May 8",  impact: "De-risks $1.4M Q2 + reseats $4.8M expansion deal" },
    { title: "Pinewood Trust recovery — bridge integration",   owner: "L. Davies", date: "May 22", impact: "Restores Q2 milestone; protects $2.4M FY26 ARR" },
    { title: "Foxglove adoption sprint",                       owner: "J. Park",   date: "May 5–Jun 10", impact: "Lifts adoption 38% → 65%; secures Q3 expansion" },
    { title: "Cobalt Federal renewal + audit-module upsell",   owner: "R. Singh",  date: "May 2",  impact: "Locks $3.6M renewal + $0.5M upsell into Q2" }
  ];

  // ----- Slide 4 (Page 6): Headcount + Role distribution + H2 plan -----
  // Headcount by account: In-Seat / Pending Onboard / Buffer
  // (Fiserv excluded; BlackRock "Ended" 1 + unlabeled 5 dropped per direction)
  const headcount = [
    { account: "Apollo Global Management",  inSeat: 37, pending: 1, buffer: 3 },
    { account: "BlackRock",                  inSeat: 19, pending: 1, buffer: 2 },
    { account: "ADS Securities LLC SPC",     inSeat: 11, pending: 0, buffer: 0 },
    { account: "Goldman Sachs",              inSeat: 6,  pending: 0, buffer: 0 }
  ];

  // Role distribution — corrected per source (Grand Total 80)
  // 43 unique roles · top 12 named, rest grouped into "Other"
  const roles_all = [
    { role: "Gen AI Engineer - India",       count: 5 },
    { role: "Principal Gen AI Engineer",     count: 5 },
    { role: "Prompt Engineer",               count: 5 },
    { role: "Gen AI Engineer",               count: 4 },
    { role: "Java Full Stack Engineer",      count: 4 },
    { role: "Java Resource",                 count: 4 },
    { role: "Data Engineer",                 count: 3 },
    { role: "LLM Engineer",                  count: 3 },
    { role: "Mobile Dev",                    count: 3 },
    { role: "Project Manager",               count: 3 },
    { role: "Chief Architect",               count: 2 },
    { role: "Delivery Manager",              count: 2 },
    { role: "Forward Deployed Engineer",     count: 2 },
    { role: "GenAI Engineer",                count: 2 },
    { role: "LLM Engineer - Buffer",         count: 2 },
    { role: "Product Owner",                 count: 2 },
    { role: "QA Engineer",                   count: 2 },
    { role: "Technical Project Manager",     count: 2 },
    { role: "AI SME Senior Engineer",        count: 1 },
    { role: "AI Specilaist",                 count: 1 },
    { role: "Business Analyst",              count: 1 },
    { role: "Data Engineer Lead",            count: 1 },
    { role: "DevOps + SRE",                  count: 1 },
    { role: "Forward Deployed AI Engineer - US", count: 1 },
    { role: "Frontend Java Engineer",        count: 1 },
    { role: "Full Stack - Data",             count: 1 },
    { role: "Fullstack Engineer",            count: 1 },
    { role: "Gen AI Engineer - US",          count: 1 },
    { role: "Lead Tech",                     count: 1 },
    { role: "Lead Tech Engineer",            count: 1 },
    { role: "LLMOps Engineer",               count: 1 },
    { role: "Platform Architect & Lead",     count: 1 },
    { role: "Principal LLM Engineer",        count: 1 },
    { role: "Product Manager",               count: 1 },
    { role: "Product/Engieering Manager",    count: 1 },
    { role: "Prompt Gen AI Engineer - India",count: 1 },
    { role: "Python Engineer - Buffer",      count: 1 },
    { role: "Salesforce Architect",          count: 1 },
    { role: "Scrum Master",                  count: 1 },
    { role: "Semarchy MDM",                  count: 1 },
    { role: "Software Engineer",             count: 1 },
    { role: "Sr. Software Engineer (Python) - India", count: 1 },
    { role: "SRE",                           count: 1 }
  ];

  // Top 12 named + Other (rest grouped)
  const TOP_N_ROLES = 12;
  const sortedRoles = [...roles_all].sort((a, b) => b.count - a.count);
  const namedRoles = sortedRoles.slice(0, TOP_N_ROLES);
  const otherRoles = sortedRoles.slice(TOP_N_ROLES);
  const otherCount = otherRoles.reduce((s, r) => s + r.count, 0);
  const roles_donut = [
    ...namedRoles,
    { role: `Other (${otherRoles.length} roles)`, count: otherCount, otherRoles: otherRoles }
  ];
  const roles_total = roles_all.reduce((s, r) => s + r.count, 0);


  return {
    quarters, qLabels, accountSeries, qoqLadder, ACTUAL_COUNT,
    q1_26_by_account,
    cy26_months, cy26_account_monthly, cy26_monthly_totals, cy26_quarters, cy26_sows,
    pipeline, pipeline_stages, pipeline_total, pipeline_weighted, pipeline_late_stage,
    accounts, q2_plan,
    headcount, roles_donut, roles_all, roles_total
  };
})();
