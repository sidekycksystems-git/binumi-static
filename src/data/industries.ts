// Per-industry content for the industry pages, served under /industries/.
//
// One record per industry drives the dynamic route src/pages/industries/[industry].astro.
// Everything identical across pages stays literal in the template, not here.
//
// COPY PASS (industry copy deck):
//   All 14 commercial industries carry approved, revenue-led copy written to the
//   seven-block template. Events keeps its own approved copy (it is not in the deck).
//   Insurance stays in `parkedIndustries` (not rendered): FinTech and Insurance both
//   fold into Financial Services, a merge decision still parked.
//
//   Proof is scaled as capability: each line uses a real named client (Generali,
//   Fujitsu, Knight Frank, S2 Partnership, Heathrow, Brabazon, AstraZeneca) framed as
//   what Binumi does, transferred to the field. Every figure is reconfirmed against
//   product.md. American spelling throughout, per the house rules.
//
// Inline-HTML fragments are preserved verbatim in the fields the template renders with
// `set:html` (hero.h1, couplet.close, proof.interim, trust.creds, cta.h2, chips with
// HTML entities).
//
// `name` is the sentence-case industry name used to derive the three VideoFrame labels in
// the template: `${name} brand film`, `${name} proof video`, `${name} trust video`. It is
// distinct from `navLabel` (the mega-menu text).

export interface Industry {
  slug: string;          // 'financial-services' -> /industries/financial-services/
  navLabel: string;      // mega-menu text, exact per the nav spec
  name: string;          // sentence-case name for video labels
  title: string;         // BaseLayout title
  description: string;   // BaseLayout description
  hero:     { h1: string; lead: string };                          // h1 has <span class="hl"> -> set:html
  couplet:  { platform: string; service: string; close: string };  // close has <strong> -> set:html
  proof:    { leadLine: string; problem: string[]; interim: string }; // interim has <span class="names"> -> set:html
  usecases: { leadLine: string; chips: string[] };
  trust:    { kicker: string; h2: string; creds: string; close: string }; // creds has <strong> -> set:html
  cta:      { h2: string };                                        // has <span class="hl"> -> set:html
  video?:   string;        // optional src for the proof + trust placeholders; empty placeholder if unset
}

// ---------------------------------------------------------------------------
// Cluster 1, Financial Services and Professional Services
// ---------------------------------------------------------------------------

const financialServices: Industry = {
  slug: 'financial-services',
  navLabel: 'Financial Services',
  name: 'Financial services',
  title: 'Binumi · Financial Services',
  description: 'How Binumi helps financial services teams turn complex, compliance-heavy communication into video that earns trust and wins mandates.',
  hero: {
    h1: 'Multiply trust. Grow the <span class="hl">book</span>.',
    lead: 'Financial services runs on trust, and trust is built one clear message at a time, across every product, market and regulator. Binumi turns complex, compliance-heavy communication into video that earns customer confidence and wins mandates, at a scale a marketing team cannot reach alone.',
  },
  couplet: {
    platform: 'Product launches, customer education, investor updates and adviser enablement, produced across every market and language.',
    service: 'A storytelling team that makes a regulated, complex proposition land with the people who have to act on it.',
    close: 'Together, financial firms communicate at <strong>the standard their license demands</strong>, across <strong>every market and channel</strong>, without adding headcount.',
  },
  proof: {
    leadLine: 'Proven across Generali, Fujitsu and Knight Frank.',
    problem: [
      'Every public message has to clear compliance before it ships. Customer education has to happen at every product launch, every rate change, every market expansion.',
      'Static decks and PDFs slow the cycle. Generic, synthetic content erodes the trust the product is working to build. The firms that turn information into clear video win the customer and keep them.',
    ],
    interim: '<span class="names">Binumi produces 500+ videos a year with Generali, across 12 European markets in 12 languages, 80% faster than before.</span> No avatars. Real video, real trust, the only standard a financial buyer accepts.',
  },
  usecases: {
    leadLine: 'One platform, every financial services moment.',
    chips: [
      'Product and proposition launches',
      'Customer onboarding and education',
      'Investor and stakeholder updates',
      'Adviser and broker enablement',
      'Regulatory and compliance communication',
      'Multi-market and multi-language campaigns',
      'Recruitment and culture',
    ],
  },
  trust: {
    kicker: 'Trust',
    h2: 'Built for a sector where every public message has to clear compliance before it ships.',
    creds: 'ISO 27001 certified. GDPR-compliant. <strong>Brand-locked workflows and role-based approval gating</strong> that match how financial compliance already works.',
    close: 'No avatars. No synthetic shortcuts. Real video, real trust.',
  },
  cta: {
    h2: 'See what becomes possible across your <span class="hl">markets</span>.',
  },
  video: 'https://d27kwhqqz0gcvq.cloudfront.net/uploads/1__2e5d44ca4c2b602a1edc2a856f746d23_h169.mp4',
};

const professionalServices: Industry = {
  slug: 'professional-services',
  navLabel: 'Professional Services',
  name: 'Professional services',
  title: 'Binumi · Professional Services',
  description: 'How Binumi helps professional services firms turn thought leadership, proposals and client communication into video that wins the work.',
  hero: {
    h1: 'Take your expertise out of the <span class="hl">deck</span>.',
    lead: 'Professional services sells expertise, but expertise buried in fifty-page proposals and dense slides rarely lands. Binumi turns thought leadership, proposals and client communication into video that earns the meeting, wins the work and shortens the time to a signed engagement.',
  },
  couplet: {
    platform: 'Pitches, proposals, onboarding and client updates, produced across every team and engagement.',
    service: 'A storytelling team that turns what your partners know into video a client actually watches to the end.',
    close: 'Together, firms win <strong>more of the work they pitch for</strong>, and onboard clients at <strong>a fraction of the cost</strong> of scattered agency spend.',
  },
  proof: {
    leadLine: 'Proven across S2 Partnership and Fujitsu.',
    problem: [
      'The expertise that wins the work is locked in documents nobody reads in full. Partners repeat the same onboarding conversation on every engagement, and every repeat is billable time spent on something a video could carry.',
      'The bid waits ten days for an agency edit while a competitor is already in the client\'s inbox. Static content is slowing the front door and the margin at the same time.',
    ],
    interim: '<span class="names">Binumi cut onboarding support-call demand by about 80% for S2 Partnership, who now produce 100+ videos internally a year.</span> The platform replaced repeated explanation with video that scales, and protected the margin underneath it.',
  },
  usecases: {
    leadLine: 'One platform, every professional services moment.',
    chips: [
      'Pitches and proposals',
      'Thought leadership',
      'Client onboarding',
      'Engagement and project updates',
      'Partner and team enablement',
      'Recruitment and culture',
      'Internal training and L&amp;D',
    ],
  },
  trust: {
    kicker: 'Trust',
    h2: 'Built for firms where client confidentiality and brand discipline are not negotiable.',
    creds: 'ISO 27001 certified. GDPR-compliant. <strong>Brand-locked asset libraries and role-based approvals</strong>, so the platform fits how your practice already governs itself.',
    close: 'Real video, your real experts, your real brand.',
  },
  cta: {
    h2: 'See what becomes possible for your <span class="hl">practice</span>.',
  },
  video: 'https://d27kwhqqz0gcvq.cloudfront.net/uploads/1__49c3e48862c3023c2591ddb136f55408_h169.mp4',
};

// ---------------------------------------------------------------------------
// Cluster 2, Technology and Telecommunications
// ---------------------------------------------------------------------------

const technology: Industry = {
  slug: 'technology',
  navLabel: 'Technology & Software',
  name: 'Technology',
  title: 'Binumi · Technology & Software',
  description: 'How Binumi helps technology teams turn complex products and dense value propositions into video that shortens the sales cycle.',
  hero: {
    h1: 'Make complex technology <span class="hl">obvious</span>.',
    lead: 'Enterprise tech buyers do not read documentation. They watch demos, share videos and forward links. Binumi turns complex products and dense value propositions into video that shortens the sales cycle and accelerates adoption.',
  },
  couplet: {
    platform: 'Product demos, sales pitches, launches and customer education, produced faster than the roadmap moves.',
    service: 'A storytelling team that turns what your engineers know into video your buyers understand.',
    close: 'Together, tech firms <strong>close deals faster</strong> and <strong>scale every launch</strong>, without waiting on a production queue or a senior engineer\'s calendar.',
  },
  proof: {
    leadLine: 'Proven across Fujitsu.',
    problem: [
      'Demos are bottlenecks that depend on senior engineers. Documentation goes unread. Buyers stall in the cycle because the value never lands in a format they will actually watch.',
      'Launches need to scale faster than the sales team can absorb, and partner ecosystems need enabling at the same pace. Too much revenue depends on too few people.',
    ],
    interim: '<span class="names">Binumi replaced 100+ Fujitsu slide decks with 90-second videos.</span> Post-meeting engagement is up 5x, and revenue influenced exceeds £20M.',
  },
  usecases: {
    leadLine: 'One platform, every tech moment.',
    chips: [
      'Product demos and explainers',
      'Technical sales pitches',
      'Customer onboarding and education',
      'Partner enablement',
      'Product launches and feature updates',
      'Internal training and L&amp;D',
      'Recruitment',
    ],
  },
  trust: {
    kicker: 'Trust',
    h2: 'Built for firms where security and IP discipline are not negotiable.',
    creds: 'ISO 27001 certified. GDPR-compliant. <strong>Brand-locked asset libraries and role-based approvals</strong>, so the platform fits how your business already governs itself.',
    close: 'Real video, your real experts, your real product. No avatars, no synthetic shortcuts.',
  },
  cta: {
    h2: 'See what becomes possible across your <span class="hl">pipeline</span>.',
  },
  video: 'https://d27kwhqqz0gcvq.cloudfront.net/uploads/1__f568be6123550de943db47af0332fd84_h169.mp4',
};

const telecommunications: Industry = {
  slug: 'telecommunications',
  navLabel: 'Telecommunications',
  name: 'Telecommunications',
  title: 'Binumi · Telecommunications',
  description: 'How Binumi helps telecoms operators turn pricing, propositions and network change into video that acquires customers and reduces churn.',
  hero: {
    h1: 'Sell the bundle. Keep the <span class="hl">customer</span>.',
    lead: 'Telecoms competes on a vast customer base, complex bundles and constant change. Binumi turns dense pricing, new propositions and network change into video clear enough to acquire customers, reduce churn and enable a retail and partner channel at scale.',
  },
  couplet: {
    platform: 'Acquisition campaigns, customer education, channel enablement and internal change, produced across every region and language.',
    service: 'A storytelling team that makes a complicated proposition simple enough to choose, and to keep.',
    close: 'Together, operators <strong>win and retain customers</strong> and <strong>enable every channel</strong>, at the scale a national base demands.',
  },
  proof: {
    leadLine: 'Proven across Generali and Fujitsu.',
    problem: [
      'Bundles and pricing change constantly, and every change has to reach millions of customers and thousands of channel staff at once. A confused customer is a churned customer.',
      'Static decks and PDFs cannot keep pace with a base this size or a roadmap this fast. The operators that turn change into clear video acquire faster and retain longer.',
    ],
    interim: '<span class="names">Binumi produces 500+ videos a year with Generali across 12 markets in 12 languages, 80% faster than before, and replaced 100+ Fujitsu decks with 90-second videos.</span> The same multi-market, high-volume engine works for a telecoms base.',
  },
  usecases: {
    leadLine: 'One platform, every telecoms moment.',
    chips: [
      'Acquisition and proposition campaigns',
      'Customer onboarding and education',
      'Bundle and pricing explainers',
      'Retail and channel enablement',
      'Network and service change communication',
      'Internal training and L&amp;D',
      'Recruitment and culture',
    ],
  },
  trust: {
    kicker: 'Trust',
    h2: 'Built for operators communicating at national scale across every channel.',
    creds: 'ISO 27001 certified. GDPR-compliant. <strong>Brand-locked, multi-language workflows</strong> with approval gating that keeps every region on message.',
    close: 'Same brand, same standard, every market and every channel.',
  },
  cta: {
    h2: 'See what becomes possible across your <span class="hl">base</span>.',
  },
  video: 'https://d27kwhqqz0gcvq.cloudfront.net/uploads/1__180e186cca69df01f98e8e9e11acb2fa_h169.mp4',
};

// ---------------------------------------------------------------------------
// Cluster 3, Industrials, Construction, Energy and Utilities, Automotive
// ---------------------------------------------------------------------------

const industrials: Industry = {
  slug: 'industrials',
  navLabel: 'Industrials & Manufacturing',
  name: 'Industrials',
  title: 'Binumi · Industrials & Manufacturing',
  description: 'How Binumi helps industrial teams turn complex projects, safety and bids into video that wins work and aligns every site.',
  hero: {
    h1: 'The work is complex. The <span class="hl">story</span> shouldn\'t be.',
    lead: 'Industrial businesses run on complex projects, multi-site operations and high-stakes safety. Binumi turns that complexity into video that wins bids, aligns teams and earns the regulator and stakeholder trust that keeps revenue moving.',
  },
  couplet: {
    platform: 'Safety, training, operational comms, project updates and bid materials, across every site.',
    service: 'A storytelling team that makes industrial complexity feel obvious.',
    close: 'Together, industrial firms communicate at <strong>the standard their projects demand</strong>, across <strong>every site and market</strong>.',
  },
  proof: {
    leadLine: 'Proven across Fujitsu, Heathrow and Brabazon.',
    problem: [
      'Industrials sell complex products and services across multiple sites and markets. Safety training has to be consistent everywhere. Bids and proposals run to hundreds of pages.',
      'Boards, regulators and communities need to understand what the work involves. Static formats slow every one of those loops, and a slow bid loop is a lost contract.',
    ],
    interim: '<span class="names">Binumi replaced 100+ Fujitsu decks with video, 5x engagement, £20M+ influenced.</span> Post-meeting engagement for multiple aviation hubs has been successful.',
  },
  usecases: {
    leadLine: 'One platform, every industrial moment.',
    chips: [
      'Safety training and certification',
      'Operational and site communication',
      'Project and stakeholder updates',
      'Bid and proposal video',
      'Regulator and community communication',
      'Sales and partner enablement',
      'Recruitment and culture',
    ],
  },
  trust: {
    kicker: 'Trust',
    h2: 'Governed centrally, executed across every site.',
    creds: 'ISO 27001 certified. GDPR-compliant. <strong>Brand-locked workflows</strong> so every video meets the standard, across every site and market.',
    close: 'Real video, your real work, every site.',
  },
  cta: {
    h2: 'See what becomes possible across your <span class="hl">projects</span>.',
  },
  video: 'https://d27kwhqqz0gcvq.cloudfront.net/uploads/1__1996cdc0540ecb68778dff407a10bf53_h169.mp4',
};

const construction: Industry = {
  slug: 'construction',
  navLabel: 'Construction',
  name: 'Construction',
  title: 'Binumi · Construction',
  description: 'How Binumi helps construction firms turn tenders, planning submissions and safety material into video that wins the work and secures consent.',
  hero: {
    h1: 'Win the tender. Carry the <span class="hl">room</span>.',
    lead: 'Construction is won and lost on bids, stakeholder buy-in and the trust to deliver. Binumi turns dense tenders, planning submissions and safety material into video that wins the work, secures consent faster and keeps every site aligned.',
  },
  couplet: {
    platform: 'Bids, planning and stakeholder communication, safety and site updates, produced across every project and partner.',
    service: 'A storytelling team that turns a complex scheme into something a client, a planner and a community can follow.',
    close: 'Together, contractors <strong>win more tenders</strong> and <strong>move schemes through consent faster</strong>, with every site on the same standard.',
  },
  proof: {
    leadLine: 'Proven across Brabazon and Fujitsu.',
    problem: [
      'A bid runs to hundreds of pages, and the people deciding it skim. Planning and community consent depend on stakeholders understanding a scheme they will never read in full.',
      'Every week a tender or a consultation stalls is a week of cost and a competitor moving first. Static formats slow the decisions that revenue depends on.',
    ],
    interim: '<span class="names">Binumi turned a complex smart-city proposal into a story stakeholders could follow, and replaced 100+ Fujitsu decks with 90-second videos, 5x engagement, £20M+ influenced.</span> The same bid-transformation engine works for a tender.',
  },
  usecases: {
    leadLine: 'One platform, every construction moment.',
    chips: [
      'Bid and tender video',
      'Planning and consultation submissions',
      'Stakeholder and community communication',
      'Safety training and certification',
      'Project and progress updates',
      'Investor and partner updates',
      'Recruitment and culture',
    ],
  },
  trust: {
    kicker: 'Trust',
    h2: 'Governed centrally, delivered across every site and partner.',
    creds: 'ISO 27001 certified. GDPR-compliant. <strong>Brand-locked workflows</strong> so every bid, site and submission meets the standard.',
    close: 'Real video, your real scheme, every stakeholder.',
  },
  cta: {
    h2: 'See what becomes possible across your <span class="hl">bids</span>.',
  },
  video: 'https://d27kwhqqz0gcvq.cloudfront.net/uploads/1__0b7bbae3a9ac1dbddb2cfe4fec59dd12_h169.mp4',
};

const energyUtilities: Industry = {
  slug: 'energy-utilities',
  navLabel: 'Energy & Utilities',
  name: 'Energy and utilities',
  title: 'Binumi · Energy & Utilities',
  description: 'How Binumi helps energy and utility operators turn complex projects, safety and change into video that wins approvals and keeps sites compliant.',
  hero: {
    h1: 'Earn the license to <span class="hl">operate</span>.',
    lead: 'Energy and utilities run on major infrastructure, heavy regulation and the trust of regulators, customers and communities. Binumi turns complex projects, safety and change into video that wins approvals, keeps a dispersed workforce safe and protects the relationships revenue depends on.',
  },
  couplet: {
    platform: 'Project, regulator and community communication, safety and field training, customer and change updates, across every site and region.',
    service: 'A storytelling team that makes infrastructure and regulation legible to the people who have to approve and act on it.',
    close: 'Together, energy and utility firms <strong>win approvals faster</strong> and <strong>keep every site compliant</strong>, on one governed standard.',
  },
  proof: {
    leadLine: 'Proven across Heathrow, Generali and Fujitsu.',
    problem: [
      'Infrastructure projects depend on regulators, communities and customers understanding complex, high-stakes work. Safety has to be consistent across a dispersed field workforce.',
      'Static submissions and PDFs slow approvals and leave field teams reading documents nobody finishes. Every delayed approval carries a real cost.',
    ],
    interim: '<span class="names">Binumi produces 500+ Generali videos a year across 12 markets in 12 languages, 80% faster than before.</span> The same engine carries a regulated, multi-site operation.',
  },
  usecases: {
    leadLine: 'One platform, every energy moment.',
    chips: [
      'Regulator and approval submissions',
      'Community and stakeholder communication',
      'Field safety training and certification',
      'Project and infrastructure updates',
      'Customer education and change communication',
      'Internal training and L&amp;D',
      'Recruitment and culture',
    ],
  },
  trust: {
    kicker: 'Trust',
    h2: 'Built for operators where safety, compliance and public trust are not negotiable.',
    creds: 'ISO 27001 certified. GDPR-compliant. <strong>Brand-locked workflows with approval gating</strong> that match how a regulated utility already governs itself.',
    close: 'Real video, real trust, every site and regulator.',
  },
  cta: {
    h2: 'See what becomes possible across your <span class="hl">network</span>.',
  },
  video: 'https://d27kwhqqz0gcvq.cloudfront.net/uploads/1__e8f4a818a863d1d1254c84c08faadf3f_h169.mp4',
};

const automotive: Industry = {
  slug: 'automotive',
  navLabel: 'Automotive',
  name: 'Automotive',
  title: 'Binumi · Automotive',
  description: 'How Binumi helps automotive brands turn launches, dealer enablement and brand material into video that sells the vehicle across every market.',
  hero: {
    h1: 'Multiply the launch. Drive the <span class="hl">network</span>.',
    lead: 'Automotive sells through launches, a brand promise and a dealer and retail network that has to carry it everywhere. Binumi turns product launches, dealer enablement and brand material into video that sells the vehicle and keeps every market on message.',
  },
  couplet: {
    platform: 'Launches, dealer and retail enablement, customer education and internal comms, produced across every market and language.',
    service: 'A storytelling team that turns engineering and brand into video a customer wants to watch and a dealer can sell with.',
    close: 'Together, automotive brands <strong>launch faster</strong> and <strong>enable every dealer</strong>, with one brand standard across every market.',
  },
  proof: {
    leadLine: 'Proven across Generali and Fujitsu.',
    problem: [
      'A launch has to reach every market and every dealer at once, on brand, in language. Product detail and brand story compete for attention with the next model and the next channel.',
      'Static decks and inconsistent local content dilute the brand and slow the sell-through. The brands that turn launches into clear, consistent video move metal faster.',
    ],
    interim: '<span class="names">Binumi produces 900+ videos a year with Knight Frank and 500+ videos for Generali across 12 markets in 12 languages, 80% faster than before.</span> The same multi-market launch engine works for a dealer network.',
  },
  usecases: {
    leadLine: 'One platform, every automotive moment.',
    chips: [
      'Product and model launches',
      'Dealer and retail enablement',
      'Customer education and walk-throughs',
      'Brand and campaign content',
      'Multi-market and multi-language rollout',
      'Internal training and L&amp;D',
      'Recruitment and culture',
    ],
  },
  trust: {
    kicker: 'Trust',
    h2: 'Built for brands that have to stay consistent across every market and dealer.',
    creds: 'ISO 27001 certified. GDPR-compliant. <strong>Brand-locked, multi-language workflows</strong> so every market launches on the same standard.',
    close: 'Same brand, same standard, every market.',
  },
  cta: {
    h2: 'See what becomes possible across your <span class="hl">markets</span>.',
  },
  video: 'https://d27kwhqqz0gcvq.cloudfront.net/uploads/1__b8dc34bcbce75207be623c2dca1d9695_h169.mp4',
};

// ---------------------------------------------------------------------------
// Cluster 4, Life Sciences and Healthcare
// ---------------------------------------------------------------------------

const lifeSciences: Industry = {
  slug: 'life-sciences',
  navLabel: 'Life Sciences & Pharma',
  name: 'Life sciences',
  title: 'Binumi · Life Sciences & Pharma',
  description: 'How Binumi helps life sciences firms turn dense data, pipeline stories and medical communication into compliant video that moves investors and partners.',
  hero: {
    h1: 'Make the science <span class="hl">land</span>.',
    lead: 'Life sciences runs on complex science, heavy regulation and the trust of investors, partners and clinicians. Binumi turns dense data, pipeline stories and medical communication into compliant video that wins partners, moves investors and protects the science as your own.',
  },
  couplet: {
    platform: 'Investor and partner communication, medical and scientific education, internal and regulatory comms, across every program and market.',
    service: 'A storytelling team that makes complex science clear without flattening it, and keeps it compliant.',
    close: 'Together, life sciences firms <strong>move investors and partners faster</strong> and <strong>educate at scale</strong>, on one governed, compliant standard.',
  },
  proof: {
    leadLine: 'Proven across Fujitsu and AstraZeneca.',
    problem: [
      'The science that wins partners and capital is buried in dense decks and data nobody outside the lab fully reads. Every regulated message has to clear review before it ships.',
      'Synthetic, avatar-based content is a disclosure and IP risk a regulated science business cannot take. Static formats slow the investor and partner conversations that funding depends on.',
    ],
    interim: '<span class="names">Binumi turned a 56-page Fujitsu presentation into engaging video pitches.</span> No avatars, real video, real trust, the only standard a regulated science buyer accepts.',
  },
  usecases: {
    leadLine: 'One platform, every life sciences moment.',
    chips: [
      'Investor and partner communication',
      'Pipeline and data storytelling',
      'Medical and scientific education',
      'Regulatory and compliance communication',
      'Congress and event content',
      'Internal training and L&amp;D',
      'Recruitment and culture',
    ],
  },
  trust: {
    kicker: 'Trust',
    h2: 'Built for a sector where disclosure, IP and review are not negotiable.',
    creds: 'ISO 27001 certified. GDPR-compliant. <strong>Brand-locked workflows with approval gating</strong> that match how medical and regulatory review already works.',
    close: 'No avatars. No synthetic shortcuts. Real video, real trust.',
  },
  cta: {
    h2: 'See what becomes possible across your <span class="hl">pipeline</span>.',
  },
  video: 'https://d27kwhqqz0gcvq.cloudfront.net/uploads/1__82ecda8ccc256a2f994f8da1d45bd179_h169.mp4',
};

const healthcare: Industry = {
  slug: 'healthcare',
  navLabel: 'Healthcare',
  name: 'Healthcare',
  title: 'Binumi · Healthcare',
  description: 'How Binumi helps healthcare providers turn patient education, clinical training and service communication into video people understand and finish.',
  hero: {
    h1: 'Make care something people actually <span class="hl">understand</span>.',
    lead: 'Healthcare depends on clarity and trust, for patients, clinicians and staff alike. Binumi turns patient education, clinical training and service communication into video people understand and finish, at the scale a multi-site provider demands.',
  },
  couplet: {
    platform: 'Patient education, clinical and staff training, service and change communication, across every site and team.',
    service: 'A storytelling team that makes complex care clear, without losing the trust the message has to carry.',
    close: 'Together, healthcare providers <strong>onboard and train at scale</strong> and <strong>reach every patient clearly</strong>, on one governed standard.',
  },
  proof: {
    leadLine: 'Proven across Generali and S2 Partnership.',
    problem: [
      'Patients skim the leaflet and miss the instruction. Clinical and compliance training has to be consistent across every site, and staff answer the same questions on repeat.',
      'Static formats leave patients confused and staff time absorbed by explanation a video could carry. Clear communication is what protects outcomes and the cost base together.',
    ],
    interim: '<span class="names">Binumi cut onboarding support-call demand by about 80% for S2 Partnership, and produces 500+ Generali videos a year across 12 markets in 12 languages, 80% faster than before.</span> The same engine carries a multi-site care provider.',
  },
  usecases: {
    leadLine: 'One platform, every healthcare moment.',
    chips: [
      'Patient education and adherence',
      'Clinical and staff training',
      'Service and pathway communication',
      'Onboarding and induction',
      'Compliance and policy communication',
      'Internal comms and engagement',
      'Recruitment and culture',
    ],
  },
  trust: {
    kicker: 'Trust',
    h2: 'Built for providers where patient trust and clinical governance are not negotiable.',
    creds: 'ISO 27001 certified. GDPR-compliant. <strong>Brand-locked workflows with approval gating</strong> that match how clinical governance already works.',
    close: 'No avatars. Real video, real trust, every patient and every site.',
  },
  cta: {
    h2: 'See what becomes possible across your <span class="hl">service</span>.',
  },
  video: 'https://d27kwhqqz0gcvq.cloudfront.net/uploads/1__66eebce85bd9c7d5de293cdf8ecef7b3_h169.mp4',
};

// ---------------------------------------------------------------------------
// Cluster 5, Real Estate, Travel and Transport, Public Sector, Education
// ---------------------------------------------------------------------------

const realEstate: Industry = {
  slug: 'real-estate',
  navLabel: 'Real Estate',
  name: 'Real estate',
  title: 'Binumi · Real Estate',
  description: 'How Binumi helps real estate firms produce on-brand video for every property, market and audience, faster than the market moves.',
  hero: {
    h1: 'The market moves <span class="hl">fast</span>. Your communication should too.',
    lead: 'Real estate runs on attention, trust and speed. Binumi helps firms produce video for every property, market and audience, faster than the market moves, so you win the listings and the deals do not wait.',
  },
  couplet: {
    platform: 'Listings, market updates, recruitment and internal communication, across every branch and market.',
    service: 'A storytelling team that turns a property and a market view into video worth watching.',
    close: 'Together, firms <strong>win more listings</strong> and <strong>move at the speed of the deal</strong>, with no specialist headcount added.',
  },
  proof: {
    leadLine: 'Proven across Knight Frank.',
    problem: [
      'Property brochures get skimmed. Market updates land flat. Recruitment, training and internal updates compete with the next listing for attention.',
      'The firms that turn information into video at scale win the listings, the agents and the markets. Static content cedes all three.',
    ],
    interim: '<span class="names">Binumi produces 800+ on-brand videos a year with Knight Frank.</span> A two-week turnaround is now two hours, cost is down 75% on the previous supplier, and LinkedIn engagement is up 5x, with no specialist headcount added.',
  },
  usecases: {
    leadLine: 'One platform, every real estate moment.',
    chips: [
      'Listing video',
      'Market updates',
      'Investor and stakeholder communication',
      'Recruitment',
      'Internal training',
      'Conference and event content',
      'Branch and team profiles',
    ],
  },
  trust: {
    kicker: 'Trust',
    h2: 'On-brand, on-message and on-channel, every time.',
    creds: '<strong>Brand-locked workflows</strong> so every video meets the standard. GDPR-compliant. ISO 27001 certified. Built for global firms across multiple markets.',
    close: 'Real video, your real brand, in every branch.',
  },
  cta: {
    h2: 'See what becomes possible across your <span class="hl">branches</span>.',
  },
  video: 'https://d27kwhqqz0gcvq.cloudfront.net/uploads/1__8f26dd641347d99c9de0c420a6296dfa_h169.mp4',
};

const travelTransport: Industry = {
  slug: 'travel-transport',
  navLabel: 'Travel, Transport & Hospitality',
  name: 'Travel and transport',
  title: 'Binumi · Travel, Transport & Hospitality',
  description: 'How Binumi helps travel and transport operators turn bookings, service change and safety into video that wins customers and aligns operations.',
  hero: {
    h1: 'Move millions. Keep them <span class="hl">informed</span>.',
    lead: 'Travel and transport runs on high-volume customer communication, multi-market operations and the trust that keeps people moving. Binumi turns bookings, service change and safety into video that wins customers, smooths operations and keeps every market on message.',
  },
  couplet: {
    platform: 'Customer and booking communication, service and disruption updates, safety and operational comms, across every market and language.',
    service: 'A storytelling team that makes a complex network simple for the customer and clear for the crew.',
    close: 'Together, operators <strong>win and reassure customers</strong> and <strong>align operations</strong>, at the scale a network demands.',
  },
  proof: {
    leadLine: 'Proven across Heathrow and Generali.',
    problem: [
      'Customers need clear information across every booking, route and disruption, in every market and language. Operations and safety messages have to reach a dispersed, shift-based workforce.',
      'Static formats cannot keep pace with a network this size or a schedule this fast. Clear communication is what protects the booking and the operation at once.',
    ],
    interim: '<span class="names">Binumi turned a complex smart-city proposal into a story stakeholders could follow, and replaced 100+ Fujitsu decks with 90-second videos, 5x engagement, £20M+ influenced.</span> The same multi-market engine carries a transport network.',
  },
  usecases: {
    leadLine: 'One platform, every travel moment.',
    chips: [
      'Customer and booking communication',
      'Service and disruption updates',
      'Safety and operational communication',
      'Destination and product marketing',
      'Crew and frontline training',
      'Multi-market and multi-language campaigns',
      'Recruitment and culture',
    ],
  },
  trust: {
    kicker: 'Trust',
    h2: 'Built for operators communicating across every market and channel.',
    creds: 'ISO 27001 certified. GDPR-compliant. <strong>Brand-locked, multi-language workflows</strong> so every market stays on the same standard.',
    close: 'Same brand, same standard, every market and every channel.',
  },
  cta: {
    h2: 'See what becomes possible across your <span class="hl">network</span>.',
  },
  video: 'https://d27kwhqqz0gcvq.cloudfront.net/uploads/1__26398698b2a1d4a8fdf60e0b3e37497b_h169.mp4',
};

const publicSector: Industry = {
  slug: 'public-sector',
  navLabel: 'Public Sector',
  name: 'Public sector',
  title: 'Binumi · Public Sector',
  description: 'How Binumi helps public sector bodies turn consultations, services and training into clear video that drives engagement and speeds delivery.',
  hero: {
    h1: 'Make public information <span class="hl">land</span>.',
    lead: 'The public sector communicates with citizens, stakeholders and a large workforce, under scrutiny and on a budget. Binumi turns consultations, services and training into clear video that drives engagement, speeds delivery and replaces scattered agency spend.',
  },
  couplet: {
    platform: 'Citizen and stakeholder communication, consultations, service and policy explainers, workforce training, across every department.',
    service: 'A storytelling team that makes complex public information clear, accessible and trusted.',
    close: 'Together, public bodies <strong>engage citizens</strong> and <strong>deliver faster</strong>, on a fraction of the cost of scattered agency spend.',
  },
  proof: {
    leadLine: 'Proven across Heathrow and Brabazon.',
    problem: [
      'Consultations and services depend on citizens and stakeholders understanding information they will never read in full. Workforce training has to be consistent across every department.',
      'Static formats lower engagement and slow delivery, and agency production absorbs budget that should reach the front line. Clear video does the opposite.',
    ],
    interim: '<span class="names">Binumi turned a complex smart-city proposal into a story stakeholders could follow, and replaced 100+ Fujitsu decks with 90-second videos, 5x engagement, £20M+ influenced.</span> The same engine carries a public consultation or service.',
  },
  usecases: {
    leadLine: 'One platform, every public sector moment.',
    chips: [
      'Citizen and stakeholder communication',
      'Consultations and engagement',
      'Service and policy explainers',
      'Workforce training and L&amp;D',
      'Change and transformation communication',
      'Accessibility and multi-language content',
      'Recruitment and culture',
    ],
  },
  trust: {
    kicker: 'Trust',
    h2: 'Built for organizations where accessibility, transparency and governance are not negotiable.',
    creds: 'ISO 27001 certified. GDPR-compliant. <strong>Brand-locked workflows with approval gating</strong> that match how public governance already works.',
    close: 'Real video, real trust, accessible to every citizen.',
  },
  cta: {
    h2: 'See what becomes possible across your <span class="hl">services</span>.',
  },
  video: 'https://d27kwhqqz0gcvq.cloudfront.net/uploads/1__97bef2cd4194830d70d2e26bb3dfae20_h169.mp4',
};

const education: Industry = {
  slug: 'education',
  navLabel: 'Education',
  name: 'Education',
  title: 'Binumi · Education',
  description: 'How Binumi helps education institutions turn prospectus, recruitment and learning content into video that wins enrollment and scales teaching.',
  hero: {
    h1: 'Multiply enrollment. Earn the <span class="hl">place</span>.',
    lead: 'Education competes for students, staff and funding on reputation and reach. Binumi turns prospectus, recruitment and learning content into video that wins enrollment, attracts talent and scales teaching, without adding production headcount.',
  },
  couplet: {
    platform: 'Recruitment and enrollment, course and learning content, staff and stakeholder communication, across every department and campus.',
    service: 'A storytelling team that turns what your educators know into video a prospective student wants to watch.',
    close: 'Together, institutions <strong>win enrollment</strong> and <strong>scale teaching and recruitment</strong>, with no specialist headcount added.',
  },
  proof: {
    leadLine: 'Proven across Knight Frank and S2 Partnership.',
    problem: [
      'Prospectuses get skimmed and open-day reach is capped by the calendar. Staff repeat the same induction and the same course explanation across every intake.',
      'Static formats limit enrollment reach and absorb staff time that teaching needs. The institutions that turn information into video at scale recruit wider and onboard cheaper.',
    ],
    interim: '<span class="names">Binumi produces 800+ on-brand videos a year with Knight Frank, a two-week turnaround cut to two hours and cost down 75%, and cut onboarding support-call demand by about 80% for S2 Partnership.</span> The same recruitment and onboarding engine carries an institution.',
  },
  usecases: {
    leadLine: 'One platform, every education moment.',
    chips: [
      'Recruitment and enrollment',
      'Prospectus and open-day content',
      'Course and learning content',
      'Student onboarding and induction',
      'Staff and stakeholder communication',
      'Internal training and L&amp;D',
      'Alumni and fundraising content',
    ],
  },
  trust: {
    kicker: 'Trust',
    h2: 'Built for institutions where safeguarding, brand and governance are not negotiable.',
    creds: 'ISO 27001 certified. GDPR-compliant. <strong>Brand-locked workflows</strong> so every department stays on the same standard.',
    close: 'Real video, your real institution, every campus.',
  },
  cta: {
    h2: 'See what becomes possible across your <span class="hl">campus</span>.',
  },
  video: 'https://d27kwhqqz0gcvq.cloudfront.net/uploads/1__798901d9d8799cbc72083adc27dca18c_h169.mp4',
};

// ---------------------------------------------------------------------------
// Events. Not in the copy deck, keeps its own approved copy.
// ---------------------------------------------------------------------------

const events: Industry = {
  slug: 'events',
  navLabel: 'Events',
  name: 'Events',
  title: 'Binumi · Events',
  description: 'How Binumi helps event organizers and corporate teams turn every event into months of on-brand video, from pre-event promotion to post-event recaps.',
  hero: {
    h1: 'Turn one event into <span class="hl">a year of content</span>.',
    lead: 'Events are expensive moments that pass in days. Binumi helps event organizers and corporate event teams turn every event into months of on-brand video, from pre-event promotion to post-event recaps and every moment in between.',
  },
  couplet: {
    platform: 'Pre-event promotion, on-site capture, same-day cuts, multi-format recaps and follow-up content, across every channel.',
    service: 'A storytelling team that keeps the energy of an event alive in video.',
    close: 'Together, every event you run delivers value <strong>long after the venue closes</strong>.',
  },
  proof: {
    leadLine: 'Proof in progress',
    problem: [
      'Events cost months of planning and end in days. The content they generate, keynotes, customer moments, brand experiences, speaker sessions, mostly evaporates before it can do its job.',
      'Pre-event promotion is fragmented across teams. Post-event recaps land too late to matter. And the moments that should drive sales, recruitment and brand for a year never make it out of the room.',
    ],
    interim: 'Binumi has produced event content for <span class="names">80+ enterprise organizations, including corporate summits, conferences and customer events run by Informa, Fujitsu, Generali and others</span>. ISO 27001 certified. GDPR-compliant.',
  },
  usecases: {
    leadLine: 'One platform, every event moment.',
    chips: [
      'Pre-event promotion and invitations',
      'Speaker reels and introductions',
      'Sponsor and exhibitor content',
      'Live event capture and same-day cuts',
      'Post-event highlights and recaps',
      'Multi-event series content',
      'Sales kickoffs and customer summits',
      'Awards and recognition',
      'Year-round content from a single event',
    ],
  },
  trust: {
    kicker: 'Trust',
    h2: 'On-brand across every speaker, sponsor and venue.',
    creds: '<strong>Brand-locked workflows</strong> so every speaker, sponsor and event lands on-brand. GDPR-compliant. ISO 27001 certified. Built for organizations running events across multiple venues, partners and markets.',
    close: 'Real video, your real brand, in every moment.',
  },
  cta: {
    h2: 'See what becomes possible for your <span class="hl">event team</span>.',
  },
  video: 'https://d27kwhqqz0gcvq.cloudfront.net/uploads/1__030ca7e69a97216b8d2e4f44c2fa4cc3_h169.mp4',
};

// ---------------------------------------------------------------------------
// Rendered set: 15 industries, ordered to match the mega-menu clusters.
// ---------------------------------------------------------------------------

export const industries: Industry[] = [
  financialServices,
  professionalServices,
  technology,
  telecommunications,
  industrials,
  construction,
  energyUtilities,
  automotive,
  lifeSciences,
  healthcare,
  realEstate,
  travelTransport,
  publicSector,
  education,
  events,
];

// ---------------------------------------------------------------------------
// PARKED, not rendered. Insurance folds into Financial Services (merge decision
// still open). Kept so the approved Generali proof is not lost.
// ---------------------------------------------------------------------------

export const parkedIndustries: Industry[] = [
  {
    slug: 'insurance',
    navLabel: 'Insurance',
    name: 'Insurance',
    title: 'Binumi · Why it works for Insurance',
    description: 'How Binumi helps insurance teams explain policies, claims, training and market updates through on-brand video at scale.',
    hero: {
      h1: 'Every market, every language, <span class="hl">one trusted voice</span>.',
      lead: 'Insurance communication has to scale across markets and stay consistent everywhere, without losing the trust the brand depends on. We turn your expertise into precise, on-brand video that travels.',
    },
    couplet: {
      platform: 'Policy explainers, claims walk-throughs, broker enablement and customer education, for every market and every language.',
      service: 'A storytelling team that turns dense, technical content into video that lands.',
      close: 'Together, insurers speak with <strong>one clear voice</strong> and <strong>the same standard in every market</strong>.',
    },
    proof: {
      leadLine: 'Proven with Generali.',
      problem: [
        'Insurance products are complex by design. Customers do not read policies. Brokers answer the same questions on repeat. Multi-market insurers fight to keep messaging consistent across languages, jurisdictions and brand standards.',
        'Static communication has been the default for decades. It is exactly what makes insurance feel impenetrable to the people who buy it.',
      ],
      interim: '<span class="names">Generali produces 500+ videos with Binumi</span> across 12 European markets, in 12 languages, 80% faster than before. Same brand, same standard, every market.',
    },
    usecases: {
      leadLine: 'One platform, every insurance moment.',
      chips: [
        'Policy explainers',
        'Claims walk-throughs',
        'Customer onboarding and education',
        'Broker enablement and training',
        'Multi-market and multi-language campaigns',
        'Internal training and L&amp;D',
        'Recruitment and culture',
      ],
    },
    trust: {
      kicker: 'Trust',
      h2: 'Built for insurers operating across regulated jurisdictions.',
      creds: 'ISO 27001 certified. GDPR-compliant. <strong>Brand-locked, multi-language workflows</strong> with approval gating that matches how insurance compliance already works.',
      close: 'Not a workaround. Real video, real trust.',
    },
    cta: {
      h2: 'See what becomes possible for your <span class="hl">insurance business</span>.',
    },
  },
];
