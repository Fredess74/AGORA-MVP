# 🖤❤️🤍 Промпт для Презентации Кофаундеру — AGORA

> Скопируй весь блок ниже в Claude, GPT-4, или Gamma.app для создания презентации.

---

```
You are a startup storyteller and presentation designer. Your task is to create a visually stunning co-founder recruitment deck — a presentation that will convince a talented technical person to join AGORA as a co-founder.

This is NOT a pitch deck for investors or judges. This is a PERSONAL and HONEST presentation for ONE person — a potential co-founder. The tone should be:
- Direct and transparent (no marketing fluff)
- Exciting but realistic (show the opportunity AND the challenges)
- Visually premium (this person should think "wow, this founder takes quality seriously")
- Respectful of their intelligence (they're a senior engineer, don't oversimplify)

DESIGN SYSTEM — STRICT RULES:
- Background: #0A0A0A (near-black) — premium, tech-forward
- Primary accent: #DC1A00 (Agora red) — for highlights, key numbers, CTAs
- Secondary: #FFFFFF (white) — for all body text
- Tertiary: #666666 (gray) — for secondary text, labels
- Typography: Inter or SF Pro (clean, modern)
- NO gradients except subtle dark-to-darker backgrounds
- RED is used SPARINGLY — only for the most important words, numbers, and dividers
- Lots of whitespace. Every slide should breathe.
- NO stock photos. Use icons, diagrams, code snippets, and screenshots only.
- Style reference: Think Apple keynote meets Stripe's developer docs

COLOR USAGE GUIDE:
- Headlines: WHITE bold
- Key numbers/stats: RED (#DC1A00) bold
- Body text: WHITE regular
- Labels/captions: GRAY (#666)
- Backgrounds: BLACK (#0A0A0A) with occasional dark card (#141414)
- Dividers/accents: RED thin lines
- Code blocks: Dark card (#1A1A1A) with syntax highlighting

=== PROJECT CONTEXT ===

AGORA — The Trusted Marketplace for AI Agents

WHAT IT IS:
A two-sided marketplace where creators of MCP servers, AI agents, and automations can list, monetize, and sell their work — with cryptographically verified trust scores (ZK zero-knowledge proofs) guaranteeing reliability. Think "App Store for AI agents with enterprise-grade security."

WHAT'S ALREADY BUILT (by a solo founder):
- Rust core library: Trust scoring algorithm (weighted: 40% interaction history, 25% identity verification, 15% longevity, 15% endorsements, 5% penalties), anti-gaming detection (velocity, sybil, uniform pattern, burst), Merkle trees, Ed25519 DIDs
- REST API: Actix-web 4, 8+ endpoints, Redis caching, Prometheus metrics, rate limiting, API key auth, RFC 7807 error handling
- ZK Proof system: Circom circuits + Groth16 provers/verifiers
- React Marketplace: Vite + TypeScript + Zustand + React Router + Supabase backend, GitHub OAuth, full CRUD for listings/reviews/API keys/usage logs
- SDKs: TypeScript (axios) + Python (httpx async) with batch queries and agent discovery
- Infrastructure: Docker + Kubernetes configs, PostgreSQL + TimescaleDB schema (6 tables, views, triggers)
- Documentation: 20+ docs files, OpenAPI spec, Postman collection, developer guide
- Stats: 58+ source files, 170+ unit tests, 3 languages (Rust, TypeScript, Python) + Circom

TECH STACK:
Backend: Rust + Actix-web | DB: PostgreSQL + TimescaleDB + Redis | Frontend: React 18 + Vite + TypeScript | Auth: Supabase + GitHub OAuth | State: Zustand | ZK: Circom + Groth16 | Crypto: Ed25519, SHA-256, Poseidon | Protocols: MCP, A2A, AP2, x402 | Deploy: Docker, Kubernetes

MARKET:
- AI agent market: $5B (2026) → $50B (2028)
- 10,000+ MCP servers exist, 97M+ SDK downloads
- MCP has NO built-in monetization — we solve this
- Main competitor: Zauth (500ms latency, no ZK, x402 only, crypto token model, security exploits)
- Our advantages: <10ms (100x faster), ZK-proofs, 4 protocols, SaaS model, no exploits

BUSINESS MODEL:
- 6 revenue streams: marketplace 10% commission, Trust API ($0.001/call), premium listings ($49-499/mo), enterprise ($2K-50K/mo), ZK proofs ($0.01/proof), discovery ads
- Unit economics: LTV/CAC = 60x, Gross Margin 85%, Break-even ~15 months
- Conservative Year 3 ARR: $4.8M (base case)
- Target: $1B+ valuation by 2028-2030

WHAT THE FOUNDER BRINGS:
- Full-stack technical skills (built entire MVP solo)
- Business vision and strategy (detailed roadmap, competitive analysis, financial model)
- Suffolk University network
- Passion and 100% commitment

WHAT WE NEED IN A CO-FOUNDER:
- Deep Rust and/or systems programming experience
- Crypto/ZK knowledge is a huge plus
- Product sense — can make architecture decisions independently
- Hunger to build something massive
- Available to go full-time (or transition within 3-6 months)
- Equity: 20-35% depending on timing and contribution

=== DECK STRUCTURE (15 slides) ===

Slide 1: COVER
- "AGORA" in large white bold
- Tagline in red: "The Trusted Marketplace for AI Agents"
- Subtitle in gray: "Co-Founder Opportunity • Confidential • February 2026"
- Minimal. Elegant. Black background with a subtle red line accent.

Slide 2: WHY I'M REACHING OUT
- Personal, honest tone: "I built this alone. It's good. But to make it great — and to win — I need a co-founder who's as obsessed with this as I am."
- This slide is about THEM, not the product. Why them specifically? What unique value do they bring?
- Show vulnerability — co-founders join people, not products.

Slide 3: THE OPPORTUNITY (30,000 ft view)
- One sentence: "AI agents will transact $5 TRILLION by 2030. They need trust. We're building that layer."
- Three key facts: market size, growth rate, why now
- Red accent on the $5T number
- Make it feel MASSIVE but grounded in data

Slide 4: THE PROBLEM
- Visual: Show the chaos — 10,000 MCP servers, no trust, no monetization, no quality signal
- Real-world example: "A developer builds an amazing MCP server for code review. Gets 500 GitHub stars. Earns $0. Meanwhile, unreliable clones confuse buyers."
- Key stat in RED: "10,000+ MCP servers. $0 monetization infrastructure."

Slide 5: OUR SOLUTION
- Clean diagram: Creator → Agora (Trust + Pay) → Buyer
- Three pillars: Marketplace + Trust Engine + Payment Layer
- Screenshot of the WORKING marketplace (not a mockup — the real thing)
- One-liner: "List in 10 minutes. Trust verified cryptographically. Get paid automatically."

Slide 6: WHAT I'VE ALREADY BUILT (The "I'm serious" slide)
- This is the key slide for a co-founder. Show the DEPTH of work already done.
- Architecture diagram showing all components:

  ┌─────────────────────────────────────┐
  │         CLIENTS                      │
  │  Web Browser │ AI SDK │ MCP Client   │
  └──────────────┼───────┼──────────────┘
                 ▼       ▼
  ┌─────────────────────────────────────┐
  │         API GATEWAY                  │
  │    TLS + Rate Limiting + Routing     │
  └──────────────┬──────────────────────┘
       ┌─────────┼──────────┐
       ▼         ▼          ▼
  ┌────────┐ ┌────────┐ ┌────────┐
  │  AUTH  │ │MARKET- │ │ TRUST  │
  │SERVICE │ │ PLACE  │ │ ENGINE │
  │        │ │        │ │        │
  │GitHub  │ │Listings│ │Score   │
  │OAuth   │ │Search  │ │ZK Proof│
  │JWT     │ │Reviews │ │Anti-   │
  │API Keys│ │Analytic│ │gaming  │
  └────────┘ └────────┘ └────────┘
       │         │          │
       ▼         ▼          ▼
  ┌─────────────────────────────────────┐
  │  PostgreSQL │ Redis │ Object Store  │
  │  TimescaleDB│ Cache │ ZK Artifacts  │
  └─────────────────────────────────────┘

- Code stats: "58 files. 170+ tests. Alone."
- Tech icons grid showing the stack
- Message: "This isn't a pitch deck startup. This is 2 months of focused, production-grade engineering."

Slide 7: TECH DEEP-DIVE (For the engineer in them)
- Show actual code snippets (Rust trust algorithm, ZK circuit structure)
- Database schema overview (6 tables, hypertables, triggers)
- Performance benchmarks: <10ms p95 trust verification
- Anti-gaming detection: velocity, sybil, burst, uniform pattern
- "If you love systems programming, this is your playground."

Slide 8: THE SECRET WEAPON — ZK PROOFS
- Simple analogy: "Imagine proving your restaurant is 5-star rated without showing a single review."
- Flow: Trust Data → Circom Circuit → Groth16 Proof → Anyone Verifies → No Data Exposed
- Why it matters: Privacy + Security + Competitive Moat
- "No competitor has this. Not Zauth. Not Google. Just us."
- This should make a crypto/ZK engineer's eyes light up.

Slide 9: COMPETITIVE LANDSCAPE
- Clean comparison table:

  │ Feature          │ Agora      │ Zauth       │ Others    │
  │──────────────────│────────────│─────────────│───────────│
  │ ZK Proofs        │ ✅ Groth16 │ ❌ None     │ ❌        │
  │ Latency          │ <10ms      │ 500-1100ms  │ N/A       │
  │ Protocols        │ 4 (MCP+)   │ 1 (x402)    │ 1-2       │
  │ Anti-Gaming      │ ✅ 4 types │ ❌          │ ❌        │
  │ Business Model   │ SaaS       │ Crypto Token│ Various   │
  │ Security Record  │ ✅ Clean   │ 🔴 Exploits │ Unknown   │

- Be HONEST about gaps too: "Zauth has users. We have tech. Together we need both."

Slide 10: BUSINESS MODEL
- 6 revenue streams as visual grid (icons + numbers)
- Key metrics in RED: "85% gross margin" + "LTV/CAC = 60x"
- Simple unit economics breakdown
- "Not a token. Not speculation. Real SaaS revenue."

Slide 11: FINANCIAL TRAJECTORY
- 3-year chart: $24K → $540K → $4.8M ARR
- Funding roadmap: Competition ($40K) → Pre-seed ($500K) → Seed ($3M) → Series A ($20M)
- "Conservative. Bottom-up. No '1% of market' fantasy."
- Break-even: Q2-Q3 2027

Slide 12: WHAT'S NEXT — 90-DAY SPRINT
- Concrete plan showing what happens if they join:
  Week 1-2: Align on architecture, set up dev environment, code review
  Week 3-4: Trust Engine hardening, API optimizations
  Week 5-8: Marketplace beta launch, first 50 creators
  Week 9-12: Suffolk competition, first revenue, seed prep
- "I have the plan. I need someone to execute it WITH me."

Slide 13: THE OFFER
- Role: Co-Founder & CTO
- Equity: 20-35% (vesting 4 years, 1 year cliff, standard)
- What you get:
  → Ground-floor equity in a $50B market opportunity
  → A codebase that's already built, not a blank canvas
  → Full technical ownership of the stack
  → Partner who handles business, fundraising, GTM
- What I need:
  → Rust/systems expertise you bring to the table
  → Partnership: honest disagreements, shared wins
  → Commitment: this is a real company, not a side project

Slide 14: THE VISION
- "By 2030, every AI agent will have a trust score. Every creator will earn from their code. The $5 trillion agent economy will run on verified trust. We're building that foundation."
- Large text, minimal design, maximum impact
- "This is a once-in-a-decade infrastructure opportunity. Visa was built for credit cards. We're building Visa for AI."

Slide 15: LET'S TALK
- "No pressure. Just a conversation."
- Contact info
- GitHub repo link (show transparency)
- "I'll buy the coffee. You bring the questions."
- Warm, human, not corporate

=== FORMAT INSTRUCTIONS ===
- For each slide, provide: Slide Title, Visual Description, Content (exact text), Speaker Notes (what to say conversationally), Design Notes
- Follow the black/red/white color system strictly
- 30pt minimum font
- Each slide should have ONE emotional takeaway
- The overall arc: Opportunity → Proof → Partnership invitation
- Total presentation length when spoken: ~12-15 minutes (casual, not rushed)
```
