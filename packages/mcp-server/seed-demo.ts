import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fnwrqgmaqempmcvcozqa.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZud3JxZ21hcWVtcG1jdmNvenFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU0NzMxNywiZXhwIjoyMDg3MTIzMzE3fQ.iIVydiiqFpTewUvs5VFKRpgEXaaCH_CxCrHLH7K17Vw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ═══════════════════════════════════════════════════════════
// AGORA DEMO CATALOG — Realistic Marketplace with History
//
// Mix of:
// • 🏢 Enterprise tools (high trust, high volume)
// • 👨‍💻 Indie developer projects (medium trust, growing)  
// • 🆕 Brand new submissions (cold start, low trust)
// • ⚠️ Abandoned/degraded tools (decaying trust)
// • 🚫 Sketchy operators (low trust, red flags)
// ═══════════════════════════════════════════════════════════

const catalog = [

    // ═══════════════════════════════════════════════════
    // 🏥 HEALTHCARE
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:rxguard-v1',
        slug: 'rxguard',
        name: 'RxGuard',
        description: 'Drug interaction checker built by a team of pharmacists and ML engineers at Mount Sinai. Cross-references 18,000+ medications for contraindications, dosing conflicts, and allergenic profiles. FDA 510(k) pending. Used by 340 pharmacies across the Northeast US. "We built this because our colleagues were checking interactions manually at 2am." — Dr. Sarah Chen, co-founder.',
        type: 'mcp_server',
        category: 'mcp_server',
        author_name: 'Dr. Sarah Chen • RxSafe Labs',
        pricing_model: 'per_call',
        price_per_call: 0.02,
        trust_score: 0.961,
        total_calls: 1280000,
        total_users: 3400,
        avg_latency_ms: 85,
        uptime: 99.99,
        tags: ['healthcare', 'pharmacy', 'drug-interactions', 'clinical', 'fda'],
        status: 'active',
        github_repo: 'https://github.com/rxsafe-labs/rxguard',
    },
    {
        did: 'did:agora:symptom-sage-v1',
        slug: 'symptom-sage',
        name: 'Symptom Sage',
        description: 'Preliminary symptom triage — built by a burned-out ER nurse who got tired of WebMD panic. Asks structured questions, maps to ICD-10 codes, and suggests whether you need ER, urgent care, or just sleep. Not a diagnosis tool — a "should I worry?" tool. HIPAA-compliant. Launched 6 months ago, growing 40% monthly.',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'Jamie Rodriguez (@nursecoder)',
        pricing_model: 'free',
        price_per_call: 0,
        trust_score: 0.847,
        total_calls: 45200,
        total_users: 12000,
        avg_latency_ms: 2100,
        uptime: 99.85,
        tags: ['healthcare', 'triage', 'symptoms', 'hipaa', 'self-care'],
        status: 'active',
        github_repo: 'https://github.com/nursecoder/symptom-sage',
    },
    {
        did: 'did:agora:medscan-ocr-v1',
        slug: 'medscan-ocr',
        name: 'MedScan OCR',
        description: 'Prescription label scanner — takes a photo of a pill bottle and extracts drug name, dosage, refill count, prescriber, and pharmacy. Built over a weekend hackathon. Author has not updated it in 4 months. Works for US labels only. Sometimes misreads cursive fonts on older labels.',
        type: 'mcp_server',
        category: 'mcp_server',
        author_name: 'Anonymous • HackMIT 2025',
        pricing_model: 'free',
        price_per_call: 0,
        trust_score: 0.312,
        total_calls: 890,
        total_users: 230,
        avg_latency_ms: 8900,
        uptime: 87.20,
        tags: ['healthcare', 'ocr', 'prescription', 'hackathon'],
        status: 'active',
        github_repo: '',
    },

    // ═══════════════════════════════════════════════════
    // 💰 FINANCE  
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:vaultmind-v1',
        slug: 'vaultmind',
        name: 'VaultMind',
        description: 'Portfolio risk engine used by 3 hedge funds. Built by ex-Goldman quants. Real-time VaR, Monte Carlo simulation, Sharpe optimization, and stress testing across equities, bonds, crypto. Processes $2.1B in AUM analytics daily. SOC 2 Type II certified. "Bloomberg Terminal intelligence at API prices."',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'VaultMind Capital • Series A',
        pricing_model: 'subscription',
        price_per_call: 0,
        subscription_price: 199.00,
        trust_score: 0.938,
        total_calls: 670000,
        total_users: 1200,
        avg_latency_ms: 340,
        uptime: 99.98,
        tags: ['finance', 'portfolio', 'risk', 'quantitative', 'hedge-fund'],
        status: 'active',
        github_repo: '',
    },
    {
        did: 'did:agora:pennypinch-v1',
        slug: 'pennypinch',
        name: 'PennyPinch',
        description: 'Personal finance tracker for Gen Z. Connect your bank via Plaid, and this agent categorizes spending, finds subscriptions you forgot about, and roasts you for buying $7 lattes. Built by a college student who blew his financial aid on DoorDash. Open source, 2.3K GitHub stars.',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'Marcus Wei (@brokedev)',
        pricing_model: 'free',
        price_per_call: 0,
        trust_score: 0.734,
        total_calls: 89000,
        total_users: 15000,
        avg_latency_ms: 1200,
        uptime: 99.40,
        tags: ['finance', 'personal', 'budgeting', 'plaid', 'gen-z'],
        status: 'active',
        github_repo: 'https://github.com/brokedev/pennypinch',
    },
    {
        did: 'did:agora:taxslayer-bot-v1',
        slug: 'taxslayer-bot',
        name: 'TaxSlayer Bot',
        description: 'Automated tax prep for US freelancers. Scans bank statements via Plaid, categorizes deductions (home office, mileage, equipment), computes quarterly estimates, and generates Schedule C. "Saved me $4,200 on my 2025 taxes." Partnered with 2 CPA firms for review. Not yet available for S-corps.',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'TaxSlayer Inc.',
        pricing_model: 'per_call',
        price_per_call: 0.50,
        trust_score: 0.856,
        total_calls: 23400,
        total_users: 5600,
        avg_latency_ms: 4200,
        uptime: 99.90,
        tags: ['tax', 'freelancer', 'irs', 'accounting', '1099'],
        status: 'active',
        github_repo: '',
    },
    {
        did: 'did:agora:shieldpay-fraud-v1',
        slug: 'shieldpay-fraud',
        name: 'ShieldPay',
        description: 'Transaction fraud detection — sub-50ms decisions on payment authorization. Analyzes 200+ signals: device fingerprint, geolocation velocity, behavioral biometrics, network graphs. Originally built for Stripe\'s internal hackathon, then spun out. Processes 14M transactions/month across 89 merchants. PCI DSS Level 1.',
        type: 'mcp_server',
        category: 'mcp_server',
        author_name: 'ShieldPay Security • YC W24',
        pricing_model: 'per_call',
        price_per_call: 0.003,
        trust_score: 0.971,
        total_calls: 24000000,
        total_users: 890,
        avg_latency_ms: 42,
        uptime: 99.999,
        tags: ['fraud', 'payments', 'security', 'fintech', 'real-time'],
        status: 'active',
        github_repo: '',
    },
    {
        did: 'did:agora:cryptoyield-v1',
        slug: 'cryptoyield-optimizer',
        name: 'CryptoYield Optimizer',
        description: 'DeFi yield farming aggregator. Claims "guaranteed 15% APY" across lending protocols. Author provides no audit trail, no team info, no GitHub repo. Smart contract addresses change every 2 weeks. Several users reported unexpected token approvals. USE WITH EXTREME CAUTION.',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'DeFi_Alpha_69',
        pricing_model: 'per_call',
        price_per_call: 0.01,
        trust_score: 0.156,
        total_calls: 3400,
        total_users: 890,
        avg_latency_ms: 12000,
        uptime: 72.30,
        tags: ['crypto', 'defi', 'yield', 'high-risk'],
        status: 'active',
        github_repo: '',
    },

    // ═══════════════════════════════════════════════════
    // ⚖️ LEGAL
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:clausekeeper-v1',
        slug: 'clausekeeper',
        name: 'ClauseKeeper',
        description: 'Contract review AI trained on 2M+ legal documents. Reads NDAs, SaaS agreements, employment contracts, and commercial leases. Highlights risky clauses, missing protections, and non-standard terms with plain-English explanations. Built by a litigation attorney who "wanted to stop reading the same bad indemnification clause for the 10,000th time."',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'Rachel Kim, Esq. • ClauseLab',
        pricing_model: 'per_call',
        price_per_call: 0.25,
        trust_score: 0.891,
        total_calls: 18700,
        total_users: 4200,
        avg_latency_ms: 5600,
        uptime: 99.85,
        tags: ['legal', 'contracts', 'nda', 'compliance', 'review'],
        status: 'active',
        github_repo: 'https://github.com/clauselab/clausekeeper',
    },
    {
        did: 'did:agora:eu-aiact-check-v1',
        slug: 'eu-aiact-compliance',
        name: 'EU AI Act Checker',
        description: 'Automated compliance assessment for the EU AI Act (2024/1689). Classifies your AI system by risk tier, checks against Articles 9-15 requirements, generates gap analysis with remediation steps, and exports audit-ready documentation packages. Already used by 12 enterprises preparing for August 2025 enforcement. Run by a former European Commission policy analyst.',
        type: 'mcp_server',
        category: 'mcp_server',
        author_name: 'Dr. Klaus Weber • RegTech EU',
        pricing_model: 'per_call',
        price_per_call: 0.10,
        trust_score: 0.924,
        total_calls: 8900,
        total_users: 420,
        avg_latency_ms: 4500,
        uptime: 99.90,
        tags: ['compliance', 'eu-ai-act', 'regulation', 'audit', 'enterprise'],
        status: 'active',
        github_repo: '',
    },

    // ═══════════════════════════════════════════════════
    // 📚 EDUCATION
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:mathmentor-v1',
        slug: 'mathmentor',
        name: 'MathMentor',
        description: 'The Khan Academy of AI tutoring agents. Adaptive math tutoring from K-12 through college. Diagnoses knowledge gaps through a 5-minute assessment, then generates personalized problem sets with step-by-step hints (never gives away the answer). Built by 2 ex-teachers and a ML engineer. 45,000 active students. Featured in EdSurge. Free forever for students.',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'MathMentor Foundation (nonprofit)',
        pricing_model: 'free',
        price_per_call: 0,
        trust_score: 0.945,
        total_calls: 3400000,
        total_users: 45000,
        avg_latency_ms: 1800,
        uptime: 99.95,
        tags: ['education', 'math', 'tutoring', 'k12', 'adaptive', 'free'],
        status: 'active',
        github_repo: 'https://github.com/mathmentor-foundation/core',
    },
    {
        did: 'did:agora:essaycoach-pro-v1',
        slug: 'essaycoach-pro',
        name: 'The Red Pen',
        description: 'Academic writing feedback — like having a strict but fair English professor available 24/7. Reviews essays for argument structure, evidence quality, citation accuracy (APA/MLA/Chicago), logical fallacies, and readability. Does NOT write essays. Created by a university writing center director frustrated with ChatGPT making students worse writers.',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'Prof. Diana Walsh (@theredpen)',
        pricing_model: 'per_call',
        price_per_call: 0.05,
        trust_score: 0.878,
        total_calls: 89000,
        total_users: 22000,
        avg_latency_ms: 3200,
        uptime: 99.80,
        tags: ['education', 'writing', 'essay', 'academic', 'feedback'],
        status: 'active',
        github_repo: 'https://github.com/theredpen/essaycoach',
    },

    // ═══════════════════════════════════════════════════
    // 🏠 REAL ESTATE
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:nestworth-v1',
        slug: 'nestworth',
        name: 'NestWorth',
        description: 'Home valuation engine — Zillow Zestimate competitor built by a data scientist who thought Zestimates were "insultingly inaccurate for anything outside the suburbs." Uses 47 features including school ratings, crime trends, walkability, planned infrastructure, and neighborhood demographic shifts. Covers 200+ US metros. Average error: 3.2% (vs Zillow\'s 6.9%).',
        type: 'mcp_server',
        category: 'mcp_server',
        author_name: 'Arun Patel (@datanerd_arun)',
        pricing_model: 'per_call',
        price_per_call: 0.50,
        trust_score: 0.867,
        total_calls: 31000,
        total_users: 4700,
        avg_latency_ms: 2800,
        uptime: 99.70,
        tags: ['real-estate', 'valuation', 'housing', 'property', 'zillow-alternative'],
        status: 'active',
        github_repo: 'https://github.com/datanerd-arun/nestworth',
    },

    // ═══════════════════════════════════════════════════
    // 🚚 LOGISTICS
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:routegenius-v1',
        slug: 'routegenius',
        name: 'RouteGenius',
        description: 'Fleet route optimization used by Amazon DSPs and FedEx contractors. Real-time traffic + weather + demand data → minimum fuel, maximum deliveries. A delivery driver-turned-developer built v1 in his van between shifts. Now handles 1,000+ vehicle fleets. Series A from Andreessen Horowitz. "The Google Maps that actually understands what it\'s like to deliver 300 packages."',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'RouteGenius Inc. • a16z backed',
        pricing_model: 'subscription',
        price_per_call: 0,
        subscription_price: 99.00,
        trust_score: 0.931,
        total_calls: 1560000,
        total_users: 340,
        avg_latency_ms: 450,
        uptime: 99.96,
        tags: ['logistics', 'routing', 'fleet', 'delivery', 'last-mile'],
        status: 'active',
        github_repo: '',
    },
    {
        did: 'did:agora:stocksense-v1',
        slug: 'stocksense',
        name: 'StockSense',
        description: 'Inventory demand forecasting for Shopify and WooCommerce stores. Pulls your sales history, factors in seasonality, upcoming promotions, and even TikTok viral trends to predict what you\'ll sell next month. Built by a former Shopify employee who saw thousands of small businesses fail from bad inventory planning. Reduces overstock 30%, stockouts 45%.',
        type: 'mcp_server',
        category: 'mcp_server',
        author_name: 'Mei Lin (@shopify_ghost)',
        pricing_model: 'per_call',
        price_per_call: 0.08,
        trust_score: 0.823,
        total_calls: 42000,
        total_users: 2800,
        avg_latency_ms: 1200,
        uptime: 99.80,
        tags: ['inventory', 'shopify', 'e-commerce', 'forecasting', 'retail'],
        status: 'active',
        github_repo: 'https://github.com/shopify-ghost/stocksense',
    },

    // ═══════════════════════════════════════════════════  
    // 👥 HIRING & HR
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:hirescope-v1',
        slug: 'hirescope',
        name: 'HireScope',
        description: 'Resume screening that doesn\'t suck. Matches candidates to roles based on demonstrated skills, not keyword bingo. Built by a recruiter who was "tired of rejecting great engineers because they didn\'t spell \'Kubernetes\' the way the ATS wanted." Bias-tested, EEOC-compliant scoring. Used by 120+ companies including 3 Fortune 500.',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'Priya Sharma • HireScope AI',
        pricing_model: 'per_call',
        price_per_call: 0.20,
        trust_score: 0.851,
        total_calls: 67000,
        total_users: 2100,
        avg_latency_ms: 3800,
        uptime: 99.85,
        tags: ['hiring', 'resume', 'recruitment', 'hr', 'bias-free'],
        status: 'active',
        github_repo: '',
    },

    // ═══════════════════════════════════════════════════
    // 🎨 CREATIVE
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:brandforge-v1',
        slug: 'brandforge',
        name: 'BrandForge',
        description: 'Brand identity generator — give it your startup idea, target audience, and vibes, get back logo concepts, color palette, typography, and brand voice guidelines. Built by a design agency that wanted to automate their $5K brand discovery workshops. "It won\'t replace a designer, but it\'ll give you a $5,000 starting point for $5."',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'Studio Neon • Design Agency',
        pricing_model: 'per_call',
        price_per_call: 0.50,
        trust_score: 0.756,
        total_calls: 15000,
        total_users: 6700,
        avg_latency_ms: 8500,
        uptime: 99.20,
        tags: ['design', 'branding', 'logo', 'startup', 'identity'],
        status: 'active',
        github_repo: '',
    },
    {
        did: 'did:agora:hookwriter-v1',
        slug: 'hookwriter',
        name: 'HookWriter',
        description: 'Video script and thumbnail analyzer for YouTube creators. Input your video idea → get 10 hook variations ranked by predicted click-through rate, a full script outline, and thumbnail composition suggestions. Trained on 500K viral videos. Built by a creator with 2.4M subscribers who "reverse-engineered Mr. Beast\'s formula."',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'Jake Torres (@createhacks)',
        pricing_model: 'per_call',
        price_per_call: 0.10,
        trust_score: 0.698,
        total_calls: 34000,
        total_users: 8900,
        avg_latency_ms: 5200,
        uptime: 98.90,
        tags: ['youtube', 'content', 'video', 'thumbnails', 'creator'],
        status: 'active',
        github_repo: 'https://github.com/createhacks/hookwriter',
    },

    // ═══════════════════════════════════════════════════
    // 🌾 FOOD & AGRICULTURE
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:farmcast-v1',
        slug: 'farmcast',
        name: 'FarmCast',
        description: 'Precision agriculture advisor used by 1,500 farms across the Midwest. Combines soil sensor data, local weather, satellite NDVI imagery, and commodity futures to recommend planting dates, irrigation schedules, and harvest timing. Built by Iowa State agronomists. "My grandpa farmed by feel. I farm by data. My yields are 22% higher."',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'FarmCast Labs • Iowa State spinoff',
        pricing_model: 'subscription',
        price_per_call: 0,
        subscription_price: 29.00,
        trust_score: 0.912,
        total_calls: 280000,
        total_users: 1500,
        avg_latency_ms: 3400,
        uptime: 99.80,
        tags: ['agriculture', 'farming', 'precision-ag', 'weather', 'crops'],
        status: 'active',
        github_repo: '',
    },

    // ═══════════════════════════════════════════════════
    // ✈️ TRAVEL
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:wanderwise-v1',
        slug: 'wanderwise',
        name: 'WanderWise',
        description: 'Travel planning that actually works. Not another "top 10 things to do in Paris" — WanderWise builds day-by-day itineraries based on your pace, budget, dietary restrictions, mobility needs, and whether you\'re a "museum person" or "street food person." Covers 190 countries. Built by a couple who quit their jobs to travel for 2 years and got frustrated by every travel app.',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'Nina & Alex Park (@wandercoders)',
        pricing_model: 'free',
        price_per_call: 0,
        trust_score: 0.834,
        total_calls: 120000,
        total_users: 45000,
        avg_latency_ms: 4800,
        uptime: 99.60,
        tags: ['travel', 'itinerary', 'planning', 'budget', 'adventure'],
        status: 'active',
        github_repo: 'https://github.com/wandercoders/wanderwise',
    },
    {
        did: 'did:agora:skyscanner-radar-v1',
        slug: 'flight-radar',
        name: 'FlightRadar Live',
        description: 'Real-time flight tracking + delay prediction. Monitors 100K flights/day. Machine learning model predicts delays 2-4 hours before airlines announce them (87% accuracy). Auto-suggests rebooking options. Built as an internal tool at a travel insurance company, now available via API. "We know your flight is delayed before the pilot does."',
        type: 'mcp_server',
        category: 'mcp_server',
        author_name: 'AeroData Systems • Travel Insurance',
        pricing_model: 'per_call',
        price_per_call: 0.02,
        trust_score: 0.918,
        total_calls: 890000,
        total_users: 12000,
        avg_latency_ms: 120,
        uptime: 99.98,
        tags: ['flights', 'tracking', 'delays', 'travel', 'prediction'],
        status: 'active',
        github_repo: '',
    },

    // ═══════════════════════════════════════════════════
    // ⚡ ENERGY
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:gridpilot-v1',
        slug: 'gridpilot',
        name: 'GridPilot',
        description: 'Smart grid optimization for utility companies. Balances solar/wind generation with demand, manages battery storage dispatch, runs demand response programs, and bids on wholesale energy markets. Currently managing 340MW of distributed energy resources across 3 utilities. Built by former Tesla Powerwall engineers.',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'GridPilot Energy • Climate tech',
        pricing_model: 'subscription',
        price_per_call: 0,
        subscription_price: 149.00,
        trust_score: 0.903,
        total_calls: 780000,
        total_users: 45,
        avg_latency_ms: 250,
        uptime: 99.99,
        tags: ['energy', 'grid', 'renewable', 'battery', 'utility'],
        status: 'active',
        github_repo: '',
    },

    // ═══════════════════════════════════════════════════
    // 🛡️ CYBERSECURITY
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:nightwatch-soc-v1',
        slug: 'nightwatch',
        name: 'NightWatch',
        description: 'SOC analyst in a box. Ingests your SIEM alerts, correlates with MITRE ATT&CK, runs automated incident response playbooks, and generates board-ready reports. Reduces false positive triage by 80%. Built by the former CISO of a major bank who "got tired of paying $200K/year for analysts to click \'ignore\' on 90% of alerts."',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'NightWatch Security • SOC-as-a-Service',
        pricing_model: 'subscription',
        price_per_call: 0,
        subscription_price: 99.00,
        trust_score: 0.934,
        total_calls: 890000,
        total_users: 450,
        avg_latency_ms: 320,
        uptime: 99.97,
        tags: ['cybersecurity', 'soc', 'siem', 'incident-response', 'mitre'],
        status: 'active',
        github_repo: '',
    },
    {
        did: 'did:agora:phishnet-v1',
        slug: 'phishnet',
        name: 'PhishNet',
        description: 'Email phishing detector. Paste any suspicious email → get a risk score, explanation of red flags, and whether links are safe. Built by a high school senior for a science fair project. Surprisingly good. Won 2nd place at ISEF. 95.2% detection rate in independent testing. Free and open source. "I built it because my grandma keeps clicking sketchy links."',
        type: 'mcp_server',
        category: 'mcp_server',
        author_name: 'Emma Zhang (age 17, @emmacodes)',
        pricing_model: 'free',
        price_per_call: 0,
        trust_score: 0.789,
        total_calls: 156000,
        total_users: 23000,
        avg_latency_ms: 450,
        uptime: 99.50,
        tags: ['security', 'phishing', 'email', 'free', 'open-source'],
        status: 'active',
        github_repo: 'https://github.com/emmacodes/phishnet',
    },

    // ═══════════════════════════════════════════════════
    // 📢 MARKETING
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:adgenius-v1',
        slug: 'adgenius',
        name: 'AdGenius',
        description: 'AI ad campaign manager for Google/Meta/LinkedIn. Generates copy variants, manages A/B tests, optimizes audiences and budgets in real-time. Average ROAS improvement: 2.3x. Built by ex-Google Ads product managers. 5,600 active advertisers managing $12M/month in combined ad spend through the platform.',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'AdGenius Inc. • ex-Google team',
        pricing_model: 'per_call',
        price_per_call: 0.15,
        trust_score: 0.845,
        total_calls: 78000,
        total_users: 5600,
        avg_latency_ms: 2900,
        uptime: 99.75,
        tags: ['marketing', 'advertising', 'google-ads', 'meta', 'roas'],
        status: 'active',
        github_repo: '',
    },
    {
        did: 'did:agora:seobot-audit-v1',
        slug: 'seobot',
        name: 'SEOBot',
        description: 'Dead simple SEO audits. Point it at any URL → get a prioritized fix list: broken links, missing meta tags, slow images, schema markup gaps, mobile issues, and Core Web Vitals problems. No jargon, just "fix this, then this, then this." Built by a freelance SEO consultant who got tired of writing the same audit report 100 times.',
        type: 'mcp_server',
        category: 'mcp_server',
        author_name: 'Tom Chen (@seotom)',
        pricing_model: 'per_call',
        price_per_call: 0.05,
        trust_score: 0.812,
        total_calls: 95000,
        total_users: 8900,
        avg_latency_ms: 7200,
        uptime: 99.40,
        tags: ['seo', 'audit', 'web-vitals', 'marketing', 'freelance'],
        status: 'active',
        github_repo: 'https://github.com/seotom/seobot',
    },

    // ═══════════════════════════════════════════════════
    // 🏭 B2B COMMERCE (Kiosk scenario)
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:timbersource-lumber-v1',
        slug: 'timbersource-lumber',
        name: 'TimberSource',
        description: 'Automated lumber procurement for the forestry industry. Matches buyers with FSC-certified timber suppliers, handles RFQ generation, price negotiation, logistics coordination, and quality verification. Used by 23 paper mills and 67 construction companies across North America. Trust-scored by Agora on every transaction — suppliers compete on verified quality, not just price.',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'Green Forest Lumber Co.',
        pricing_model: 'per_call',
        price_per_call: 0.10,
        trust_score: 0.912,
        total_calls: 28470,
        total_users: 340,
        avg_latency_ms: 3200,
        uptime: 99.80,
        tags: ['b2b', 'lumber', 'procurement', 'forestry', 'supply-chain'],
        status: 'active',
        github_repo: '',
    },
    {
        did: 'did:agora:papermill-procurement-v1',
        slug: 'papermill-ai',
        name: 'PaperMill AI',
        description: 'Industrial procurement agent for paper and packaging manufacturers. Automates raw material sourcing, supplier comparison, and delivery scheduling. Integrates with SAP and Oracle ERP for seamless PO generation. "Before PaperMill AI, our procurement team spent 60% of their time on phone calls. Now the AI handles the calls and humans handle the relationships."',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'Northern Paper Co. • Boston',
        pricing_model: 'per_call',
        price_per_call: 0.10,
        trust_score: 0.878,
        total_calls: 4200,
        total_users: 120,
        avg_latency_ms: 2800,
        uptime: 99.70,
        tags: ['b2b', 'procurement', 'manufacturing', 'erp', 'paper'],
        status: 'active',
        github_repo: '',
    },

    // ═══════════════════════════════════════════════════
    // 🏛️ GOVERNMENT
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:civicpulse-v1',
        slug: 'civicpulse',
        name: 'CivicPulse',
        description: 'Citizen feedback analysis for city governments. Processes 311 reports, public meeting transcripts, survey responses, and local social media. Shows trending issues by neighborhood, tracks sentiment over time, and generates weekly briefings for city council. Currently used by 3 US cities (pop. 50K-200K). Built by a former city data officer.',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'David Okafor • former Boston 311',
        pricing_model: 'free',
        price_per_call: 0,
        trust_score: 0.723,
        total_calls: 34000,
        total_users: 120,
        avg_latency_ms: 2800,
        uptime: 99.10,
        tags: ['government', 'civic', 'feedback', '311', 'public-sector'],
        status: 'active',
        github_repo: 'https://github.com/dokafor/civicpulse',
    },

    // ═══════════════════════════════════════════════════
    // 🏭 MANUFACTURING (high trust enterprise)
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:qualityeye-v1',
        slug: 'qualityeye',
        name: 'QualityEye',
        description: 'Visual defect detection for manufacturing lines. Computer vision inspects products at 120fps on the assembly line — PCBs, automotive parts, pharmaceutical packaging, food items. 99.7% defect detection rate, 0.01% false positive rate. Already deployed in 4 factories (2 automotive, 1 electronics, 1 pharma). "Our human inspectors catch 85% of defects. QualityEye catches 99.7%. We kept the humans for the 0.3%."',
        type: 'mcp_server',
        category: 'mcp_server',
        author_name: 'QualityEye GmbH • Munich',
        pricing_model: 'subscription',
        price_per_call: 0,
        subscription_price: 499.00,
        trust_score: 0.967,
        total_calls: 12000000,
        total_users: 28,
        avg_latency_ms: 8,
        uptime: 99.999,
        tags: ['manufacturing', 'quality', 'computer-vision', 'inspection', 'enterprise'],
        status: 'active',
        github_repo: '',
    },

    // ═══════════════════════════════════════════════════
    // 💬 CUSTOMER SERVICE
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:helpdesk-hero-v1',
        slug: 'helpdesk-hero',
        name: 'Helpdesk Hero',
        description: 'L1/L2 support ticket handler. Understands your product docs, retrieves relevant KB articles, drafts responses, and escalates complex issues with full context. Average resolution: 3 minutes vs 45 minutes human. BUT—it sometimes over-apologizes and can be confidently wrong about edge cases. Best used as a draft generator, not autonomous responder.',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'SupportFlow Inc.',
        pricing_model: 'per_call',
        price_per_call: 0.008,
        trust_score: 0.798,
        total_calls: 560000,
        total_users: 3400,
        avg_latency_ms: 1400,
        uptime: 99.80,
        tags: ['customer-service', 'support', 'tickets', 'helpdesk'],
        status: 'active',
        github_repo: '',
    },

    // ═══════════════════════════════════════════════════
    // ⚠️ DEGRADED / ABANDONED (low trust)
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:translate-master-v1',
        slug: 'translate-master',
        name: 'TranslateMaster 3000',
        description: 'Claimed "professional-grade" translation for 40 languages. Was decent when it launched 8 months ago. Author stopped maintaining it after getting a full-time job. Model weights are stuck on 2024 training data. Increasingly inaccurate for newer terminology. Latency has tripled as the free-tier host throttles it. Several users report it just returns empty strings for Japanese.',
        type: 'mcp_server',
        category: 'mcp_server',
        author_name: 'Unknown (last seen: 6 months ago)',
        pricing_model: 'free',
        price_per_call: 0,
        trust_score: 0.234,
        total_calls: 12000,
        total_users: 890,
        avg_latency_ms: 15000,
        uptime: 67.50,
        tags: ['translation', 'abandoned', 'multilingual', 'declining'],
        status: 'active',
        github_repo: '',
    },
    {
        did: 'did:agora:infinite-content-v1',
        slug: 'infinite-content',
        name: 'Infinite Content Generator',
        description: '"Generate 1000 SEO articles per hour!" Essentially a thin wrapper around a free LLM API with zero quality control. Produces grammatically correct but factually hallucinated content. Multiple users flagged it for generating medical misinformation. Author responds to criticism with "it\'s just a tool bro." No terms of service, no content policy.',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'ContentKing_99',
        pricing_model: 'per_call',
        price_per_call: 0.001,
        trust_score: 0.089,
        total_calls: 45000,
        total_users: 1200,
        avg_latency_ms: 890,
        uptime: 94.00,
        tags: ['content', 'seo', 'spam', 'low-quality', 'risky'],
        status: 'active',
        github_repo: '',
    },

    // ═══════════════════════════════════════════════════
    // 🆕 BRAND NEW (cold start)
    // ═══════════════════════════════════════════════════

    {
        did: 'did:agora:contract-whisper-v1',
        slug: 'contract-whisper',
        name: 'Contract Whisper',
        description: 'Just launched yesterday. Reads freelance contracts and tells you if the payment terms will screw you over. Built by a freelance designer who got burned by a "net-90" clause she didn\'t understand. Only tested on US contracts so far. 0 reviews yet. Looks promising but unproven.',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'Lisa Park (@designerlisa)',
        pricing_model: 'free',
        price_per_call: 0,
        trust_score: 0.445,
        total_calls: 47,
        total_users: 12,
        avg_latency_ms: 6700,
        uptime: 98.00,
        tags: ['legal', 'freelance', 'contracts', 'new', 'beta'],
        status: 'active',
        github_repo: 'https://github.com/designerlisa/contract-whisper',
    },
    {
        did: 'did:agora:petvet-ai-v1',
        slug: 'petvet-ai',
        name: 'PetVet AI',
        description: 'Submitted this morning. "Is my dog sick or just dramatic?" — preliminary pet symptom checker. Covers dogs and cats only. Built by a veterinary student as a thesis project. No production usage yet. Interesting concept but zero track record. Trust score reflects cold-start — will improve with usage data.',
        type: 'ai_agent',
        category: 'ai_agent',
        author_name: 'Carlos Mendez (vet student, Cornell)',
        pricing_model: 'free',
        price_per_call: 0,
        trust_score: 0.380,
        total_calls: 3,
        total_users: 2,
        avg_latency_ms: 4500,
        uptime: 100.00,
        tags: ['pets', 'veterinary', 'health', 'new', 'student-project'],
        status: 'active',
        github_repo: 'https://github.com/carlosdvm/petvet-ai',
    },
];

// ═══════════════════════════════════════════════════════════
// RUNNER — Delete old demo agents + insert new
// ═══════════════════════════════════════════════════════════

async function seedDemo() {
    console.log(`\n🏛️  AGORA — Seeding ${catalog.length} demo agents with stories...\n`);

    // Delete OLD demo agents (from previous seed)
    const oldDids = [
        'did:agora:medcheck-diagnostics-v1', 'did:agora:pharma-interactions-v1',
        'did:agora:finscope-analytics-v1', 'did:agora:taxbot-filing-v1',
        'did:agora:fraud-sentinel-v1', 'did:agora:legalparse-contracts-v1',
        'did:agora:ip-patent-scout-v1', 'did:agora:tutorcraft-math-v1',
        'did:agora:essaycoach-v1', 'did:agora:propval-estimator-v1',
        'did:agora:lease-negotiator-v1', 'did:agora:routemaster-logistics-v1',
        'did:agora:inventory-prophet-v1', 'did:agora:talentmatch-recruiter-v1',
        'did:agora:onboard-flow-v1', 'did:agora:brandcraft-identity-v1',
        'did:agora:videoscript-ai-v1', 'did:agora:cropwise-advisory-v1',
        'did:agora:foodsafe-inspector-v1', 'did:agora:voyageplan-travel-v1',
        'did:agora:flightwatch-monitor-v1', 'did:agora:gridbalance-energy-v1',
        'did:agora:carbontrack-emissions-v1', 'did:agora:supportbot-cx-v1',
        'did:agora:qualityeye-inspect-v1', 'did:agora:civicpulse-feedback-v1',
        'did:agora:threatscape-soc-v1', 'did:agora:adcraft-campaign-v1',
        'did:agora:seomaster-audit-v1', 'did:agora:timbersource-lumber-v1',
        'did:agora:papermill-procurement-v1',
    ];

    const { error: delErr } = await supabase.from('listings').delete().in('did', oldDids);
    if (delErr) console.log('⚠️  Old cleanup:', delErr.message);
    else console.log(`🧹 Cleaned ${oldDids.length} old generic agents.\n`);

    // Also delete new DIDs if re-running
    const newDids = catalog.map(a => a.did);
    await supabase.from('listings').delete().in('did', newDids);

    // Insert
    const batchSize = 10;
    let inserted = 0;

    for (let i = 0; i < catalog.length; i += batchSize) {
        const batch = catalog.slice(i, i + batchSize);
        const { data, error } = await supabase.from('listings').insert(batch).select('name, trust_score, author_name');

        if (error) {
            console.error(`❌ Batch failed:`, error.message);
            for (const agent of batch) {
                const { error: e } = await supabase.from('listings').insert(agent);
                if (e) console.error(`  ❌ ${agent.name}: ${e.message}`);
                else { console.log(`  ✅ ${agent.name} (${agent.trust_score}) — ${agent.author_name}`); inserted++; }
            }
        } else {
            data?.forEach(d => {
                const score = Number(d.trust_score);
                const tier = score >= 0.9 ? '🟢' : score >= 0.7 ? '🟡' : score >= 0.4 ? '🟠' : '🔴';
                console.log(`  ${tier} ${d.name} (${score.toFixed(3)}) — ${d.author_name}`);
            });
            inserted += data?.length || 0;
        }
    }

    console.log(`\n🎉 Done! ${inserted}/${catalog.length} agents seeded.`);

    // Count total
    const { count } = await supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active');
    console.log(`📊 Total active agents in database: ${count}`);
    process.exit(0);
}

seedDemo().catch(err => { console.error('Seed error:', err); process.exit(1); });
