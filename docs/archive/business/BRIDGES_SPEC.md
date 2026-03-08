# 🌉 BRIDGES — Team Synergy Assessment System

> **Prompt + Architecture Spec для полного построения проекта**  
> Скопируй этот документ целиком в AI-ассистент для пошагового создания приложения.

---

```
You are a senior full-stack engineer specializing in interactive web applications with premium design. Your task is to build BRIDGES — a proprietary team psychology and synergy assessment tool.

════════════════════════════════════════════════════
PART 1: PRODUCT VISION
════════════════════════════════════════════════════

BRIDGES (Building Reliable Insights for Dynamic Group Evaluation & Synergy) is a 7-minute interactive assessment that maps a person's:
- Behavioral drives (how they ACT)
- Cognitive patterns (how they THINK)
- Values & motivation (WHY they do it)
- Work style (HOW they collaborate)

After individual assessments, BRIDGES generates team synergy reports when multiple profiles are loaded together.

KEY PRINCIPLES:
1. ZERO typing — only clicks, sliders, drag-and-drop
2. 7 minutes MAX to complete
3. Premium dark design (black #0A0A0A, red #DC1A00, white #FFFFFF)
4. Charts and visual analytics (Canvas/SVG, not images)
5. Downloadable JSON profile files
6. Team mode: load 2-5 profiles → get synergy report
7. Localhost only — no server, no database, pure frontend
8. Mobile-friendly but desktop-optimized

════════════════════════════════════════════════════
PART 2: ASSESSMENT FRAMEWORK — "THE 7 BRIDGES"
════════════════════════════════════════════════════

The assessment measures 7 dimensions (the "bridges" between people). Each dimension is scored 1-10 through interactive exercises. This is an ORIGINAL framework, not a copy of any existing tool.

BRIDGE 1: DRIVE (Dominance vs Stability)
- Measures: Initiative, risk tolerance, pace, decisiveness
- High Drive = moves fast, takes charge, disrupts
- Low Drive = steady, methodical, risk-aware, preserves
- Assessment method: 6 forced-choice pairs (click A or B)

BRIDGE 2: SOCIAL ENERGY (Extraversion vs Introversion)
- Measures: Communication style, team interaction, energy source
- High = energized by people, talks to think, collaborative
- Low = energized by focus, thinks to talk, independent
- Assessment method: Slider scale on 5 scenarios

BRIDGE 3: PRECISION (Structure vs Flexibility)
- Measures: Attention to detail, planning, process adherence
- High = systematic, thorough, quality-obsessed
- Low = adaptive, big-picture, speed-over-perfection
- Assessment method: Drag-and-drop priority ranking of 8 work values

BRIDGE 4: RESILIENCE (Emotional Stability)
- Measures: Stress response, pressure handling, emotional regulation
- High = calm under fire, thick-skinned, steady
- Low = passionate, reactive, emotionally invested
- Assessment method: 5 scenario reactions (click best-fit response)

BRIDGE 5: VISION (Strategic vs Tactical)
- Measures: Time horizon, abstraction level, planning scope
- High = long-term thinker, systems thinker, visionary
- Low = execution-focused, practical, now-oriented
- Assessment method: Slider on 5 trade-off continuums

BRIDGE 6: OWNERSHIP (Autonomy vs Collaboration)
- Measures: Decision style, accountability preference, work mode
- High = solo executor, full ownership, self-directed
- Low = team player, shared responsibility, consensus
- Assessment method: 6 forced-choice pairs

BRIDGE 7: PURPOSE (Impact Motivation)
- Measures: What drives the person at the deepest level?
- Subcategories: Mission (change the world), Mastery (be the best), Money (financial freedom), Meaning (help people), Legacy (build something lasting)
- Assessment method: Distribute 10 points across 5 categories (drag sliders)

TOTAL: ~35 interactions × average 12 seconds = ~7 minutes

════════════════════════════════════════════════════
PART 3: TECH STACK & ARCHITECTURE
════════════════════════════════════════════════════

STACK:
- Pure HTML + CSS + Vanilla JavaScript (NO frameworks, NO build tools)
- Single index.html file with embedded CSS and JS
- Charts: Canvas 2D API (no libraries)
- Data: localStorage + JSON file download/upload
- Open with: double-click index.html → runs in browser

WHY NO FRAMEWORK:
- Zero setup — open and it works
- No npm, no Vite, no React — just a file
- Founder can share the file via email/Slack
- Works offline
- Maximum performance

FILE STRUCTURE:
```

BRIDGES/
├── index.html          ← Single-file app (everything inside)
├── profiles/           ← Directory for saved profile JSONs
│   ├── john_doe.json
│   ├── jane_smith.json
│   └── alex_chen.json
└── README.md           ← How to use

```

APPLICATION ARCHITECTURE (inside index.html):

```

┌─────────────────────────────────────────────────────────┐
│  SCREENS (managed by JS state machine)                   │
│                                                          │
│  1. WELCOME        → Start assessment / Load profiles    │
│  2. ASSESSMENT      → 7 bridges (multi-step wizard)      │
│  3. RESULTS         → Individual profile + charts        │
│  4. TEAM SYNERGY    → Multi-profile analysis + report    │
│                                                          │
│  State: { screen, step, answers[], profiles[] }          │
└─────────────────────────────────────────────────────────┘

```

════════════════════════════════════════════════════
PART 4: SCREEN-BY-SCREEN SPECIFICATION
════════════════════════════════════════════════════

SCREEN 1: WELCOME
─────────────────
Layout: Centered, minimal, premium feel
Elements:
- BRIDGES logo (CSS text, not image): large, white, letter-spaced
- Tagline: "7 minutes to understand your team" in gray
- Two large buttons:
  [🚀 Start Assessment] — red button, prominent
  [📊 Team Synergy Mode] — outlined button, secondary
- Footer: "Built for Agora · v1.0" in small gray text

SCREEN 2: ASSESSMENT (7-step wizard)
────────────────────────────────────
Layout: Full-screen, one question at a time, progress bar at top

PROGRESS BAR:
- 7 segments (one per bridge), filled red as you progress
- Current bridge name displayed: "Bridge 2 of 7: Social Energy"
- Thin, elegant, at the very top of the page

INTERACTION TYPES (no keyboard input ever):

Type A — FORCED CHOICE (Bridges 1, 4, 6):
- Show two statements side by side
- User clicks one
- Selected one glows red, other dims
- Auto-advances after 500ms delay
- Example:
  ┌──────────────────┐  ┌──────────────────┐
  │ "I prefer to act  │  │ "I prefer to plan │
  │  first and adjust │  │  carefully before  │
  │  later"           │  │  taking action"    │
  └──────────────────┘  └──────────────────┘

Type B — SLIDER (Bridges 2, 5):
- Show a scenario/statement
- Below it, a horizontal slider from left label to right label
- Slider thumb is red circle, track is gray with red fill
- Value updates in real-time (no submit button)
- "Next" button appears at bottom after slider is moved
- Example:
  "When facing a new problem, I tend to:"
  ─────────●──────────────────────
  "Jump in immediately"    "Research first"

Type C — DRAG RANKING (Bridge 3):
- 8 work value cards displayed
- User drags to rank from most to least important
- Cards snap into numbered slots (1-8)
- Smooth animation on drag
- Cards: "Speed", "Quality", "Innovation", "Process",
         "Results", "Harmony", "Growth", "Stability"

Type D — POINT DISTRIBUTION (Bridge 7):
- 5 categories shown as rows
- Each has a slider (0-10)
- Total must equal 10 (budget meter at top)
- When total = 10, remaining sliders cap at 0 remaining
- Real-time pie chart preview on the right
- Categories: Mission, Mastery, Money, Meaning, Legacy

TRANSITIONS:
- Smooth fade between questions (CSS transitions, 300ms)
- No page reloads
- Back button available (but subtle)

SCREEN 3: INDIVIDUAL RESULTS
────────────────────────────
Layout: Dashboard-style, scrollable

Section A — PROFILE SUMMARY
- Name input (the ONLY text input in the app — just first name, optional)
- Archetype title (generated from scores), example:
  "The Strategic Builder" or "The Precision Executor"
- One-line description: "You drive through vision and systematic execution"
- Date of assessment

Section B — BRIDGE RADAR CHART (Canvas 2D)
- Heptagonal (7-sided) radar chart
- Each axis = one bridge dimension (1-10)
- Filled area with red (#DC1A00) at 20% opacity
- Axis labels around the chart
- Animated draw-in on page load (line draws from center outward)

Section C — INDIVIDUAL BRIDGE BREAKDOWN
- 7 horizontal bars (one per bridge)
- Each shows: Bridge name, score (1-10), label (e.g. "High Drive")
- Bar fills with gradient from dark to red based on score
- Tooltip on hover showing what the score means

Section D — ARCHETYPE ANALYSIS
- Based on the combination of all 7 scores, assign one of 12 archetypes:
  1. The Commander (High Drive + High Vision + High Ownership)
  2. The Architect (High Precision + High Vision + Moderate Drive)
  3. The Catalyst (High Social + High Drive + Low Precision)
  4. The Guardian (High Precision + High Resilience + Low Drive)
  5. The Visionary (High Vision + High Purpose + Low Precision)
  6. The Executor (High Drive + High Precision + Low Vision)
  7. The Diplomat (High Social + High Resilience + Low Ownership)
  8. The Maverick (High Drive + Low Precision + High Ownership)
  9. The Sage (High Vision + High Resilience + Low Social)
  10. The Builder (High Ownership + High Precision + High Purpose)
  11. The Connector (High Social + High Purpose + Low Ownership)
  12. The Operator (Moderate all — balanced generalist)

- Show: Archetype icon (emoji), title, 3-sentence description
- "Best paired with:" — complementary archetype
- "Watch out for:" — potential friction archetype

Section E — PURPOSE BREAKDOWN
- Pie chart or donut chart showing Mission/Mastery/Money/Meaning/Legacy split
- Shows the dominant driver prominently

Section F — EXPORT
- [📥 Download Profile (.json)] button — saves full profile data
- JSON includes: name, date, scores[7], answers[], archetype, purpose_split
- Filename: bridges_firstname_YYYYMMDD.json

SCREEN 4: TEAM SYNERGY MODE
───────────────────────────
Layout: Upload profiles → Generate team report

Step 1: Upload
- Drag-and-drop zone for JSON files
- Or [Browse Files] button
- Shows loaded profiles as cards:
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ 🧑 John  │ │ 👩 Jane  │ │ 🧑 Alex  │
  │ Commander│ │ Architect│ │ Catalyst │
  │ ✕ remove │ │ ✕ remove │ │ ✕ remove │
  └──────────┘ └──────────┘ └──────────┘
- [Generate Synergy Report] button (enabled when 2+ profiles loaded)

Step 2: Team Synergy Report (auto-generated)

Section A — TEAM RADAR OVERLAY
- Same radar chart but with ALL profiles overlaid
- Each person in a different color (red, blue, orange, green, purple)
- Legend showing names
- Shows where the team is strong and where gaps exist

Section B — SYNERGY MATRIX
- Grid showing every pair's synergy score (0-100%)
- Synergy = how well their strengths complement each other's gaps
- Formula: For each bridge, if |personA - personB| > 3, complementary = +points
           If same direction AND both high, synergy for that bridge = +points
           If same direction AND both low, gap = -points
- Color coded: Green (>70%), Yellow (40-70%), Red (<40%)
- Example:
         John    Jane    Alex
  John    —      78%     45%
  Jane   78%      —      82%
  Alex   45%     82%      —

Section C — TEAM STRENGTHS & GAPS
- Top 3 team strengths (bridges where combined avg > 7)
- Top 3 team gaps (bridges where combined avg < 4)
- For each gap: "Recommendation: Hire someone with high [Bridge X]"

Section D — RECOMMENDED ROLE DISTRIBUTION
- Based on archetype + scores, suggest who should own what:
  Example:
  "John (Commander): CEO / Strategy & Fundraising — High Drive + Vision"
  "Jane (Architect): CTO / System Design & Quality — High Precision + Vision"
  "Alex (Catalyst): Growth / BD & Partnerships — High Social + Drive"

Section E — POTENTIAL FRICTION POINTS
- Where pairs might clash based on opposing extreme scores
- Example: "John (Drive: 9) and Jane (Drive: 3) may clash on pace of decision-making"
- Mitigation suggestion for each friction point

Section F — TEAM PURPOSE ALIGNMENT
- Combined pie chart of all Purpose (Bridge 7) distributions
- Shows if team is aligned (all mission-driven) or diverse (healthy)
- "Purpose alignment: 72% — Strong shared motivation around Mission and Mastery"

Section G — EXPORT TEAM REPORT
- [📥 Download Team Report (.json)] — full team data
- [🖨 Print Report] — print-friendly CSS with white background

════════════════════════════════════════════════════
PART 5: DESIGN SYSTEM
════════════════════════════════════════════════════

COLORS:
- Background: #0A0A0A (near-black)
- Cards: #141414
- Card hover: #1E1E1E
- Primary accent: #DC1A00 (Agora red)
- Text primary: #FFFFFF
- Text secondary: #888888
- Text muted: #555555
- Success: #00C853
- Warning: #FF9100
- Info: #448AFF
- Border: #2A2A2A
- Slider track: #333333
- Slider fill: #DC1A00

TYPOGRAPHY:
- Font: Inter (Google Fonts import)
- Headings: 700-800 weight
- Body: 400
- Sizes: 48px title, 24px section headers, 16px body, 13px labels, 11px captions

COMPONENTS:
- Buttons: rounded corners (12px), padding 14px 28px, red bg for primary, border for secondary
- Cards: border-radius 16px, subtle border, no shadow
- Progress bar: 4px height, red fill, smooth transition
- Sliders: custom styled (hide native appearance), 6px track, 20px red thumb with glow
- Drag items: 56px height cards, lift effect on drag (transform: scale(1.02) + shadow)
- Charts: animated draw with requestAnimationFrame
- Transitions: 300ms ease for all state changes

RESPONSIVE:
- Max-width: 800px centered for assessment
- Max-width: 1100px for results/team mode
- Touch-friendly: all targets minimum 44px

ACCESSIBILITY:
- All interactive elements focusable via keyboard (tab order)
- Aria labels on sliders and buttons
- High contrast (red on black passes WCAG AA for large text)

════════════════════════════════════════════════════
PART 6: SCORING ALGORITHMS
════════════════════════════════════════════════════

INDIVIDUAL SCORING:
Each bridge produces a score 1-10:

Bridge 1 (Drive): 6 forced choices, each worth 0 or 1 → sum × 10/6 → round to 1-10
Bridge 2 (Social): 5 sliders (each 1-10) → average → round
Bridge 3 (Precision): Ranking of 8 items → top 3 items get weight × position → custom formula
Bridge 4 (Resilience): 5 scenario choices (each scored 0-2) → sum × 10/10 → round
Bridge 5 (Vision): 5 sliders → average
Bridge 6 (Ownership): 6 forced choices → same as Bridge 1
Bridge 7 (Purpose): 10-point distribution → stored as 5 sub-scores

ARCHETYPE ASSIGNMENT:
- Find top 3 highest bridges (excluding Purpose)
- Match against archetype patterns (lookup table of 12 archetypes)
- If no strong match → "Operator" (balanced)

SYNERGY SCORING (PAIRWISE):
For persons A and B:
synergy = 0
For each bridge (1-6):
  diff = abs(A.score - B.score)
  if diff >= 4: synergy += 15 (COMPLEMENTARY — they cover each other's gaps)
  elif diff <= 2 and both >= 7: synergy += 12 (SHARED STRENGTH)
  elif diff <= 2 and both <= 4: synergy -= 8 (SHARED GAP)
  else: synergy += 5 (MODERATE)

Purpose alignment: compare top purpose driver
  if same top driver: synergy += 10
  if different top driver: synergy += 5 (diversity is healthy)

Normalize to 0-100%

════════════════════════════════════════════════════
PART 7: SAMPLE QUESTIONS
════════════════════════════════════════════════════

BRIDGE 1 — DRIVE (Forced Choice):
1. "Act fast, adjust later" vs "Plan carefully, then execute"
2. "I set the pace for my team" vs "I match the team's pace"
3. "Competition energizes me" vs "Collaboration energizes me"
4. "I prefer to disrupt" vs "I prefer to optimize"
5. "When uncertain, I decide" vs "When uncertain, I gather more info"
6. "I'd rather ask forgiveness" vs "I'd rather ask permission"

BRIDGE 2 — SOCIAL ENERGY (Sliders):
1. "After a long meeting, I feel:" Energized ←→ Drained
2. "I brainstorm best:" In a group ←→ Alone
3. "I share ideas:" Immediately ←→ Once polished
4. "Networking events feel:" Exciting ←→ Exhausting
5. "I process decisions:" Talking it through ←→ Quiet reflection

BRIDGE 3 — PRECISION (Drag Rank):
Rank these from MOST to LEAST important to you:
Speed, Quality, Innovation, Process, Results, Harmony, Growth, Stability

BRIDGE 4 — RESILIENCE (Scenario Choice):
1. "A client rejects your pitch harshly. You:"
   a) Review feedback calmly and iterate [2]
   b) Feel frustrated, take a walk, return focused [1]
   c) Take it personally, it affects your whole day [0]
2. "Your co-founder disagrees with your core idea. You:"
   a) Listen, find common ground, adapt [2]
   b) Defend your position passionately [1]
   c) Feel undermined and withdraw [0]
... (3 more scenarios)

BRIDGE 5 — VISION (Sliders):
1. "I prefer to focus on:" This week ←→ This decade
2. "I think in terms of:" Specific tasks ←→ Systems & patterns
3. "Success to me is:" Completing projects ←→ Building legacy
4. "I get excited about:" Fixing today's problems ←→ Imagining the future
5. "In meetings, I focus on:" Actionable next steps ←→ Long-term strategy

BRIDGE 6 — OWNERSHIP (Forced Choice):
1. "I prefer to own the outcome fully" vs "I prefer shared ownership"
2. "I work best with full autonomy" vs "I work best with a team"
3. "I make decisions alone" vs "I seek consensus"
4. "I prefer being accountable to myself" vs "Accountable to the group"
5. "I'd rather do something myself" vs "Delegate and oversee"
6. "My best work is solo" vs "My best work is collaborative"

BRIDGE 7 — PURPOSE (Distribute 10 points):
- Mission: "Change the world, solve big problems"
- Mastery: "Be the absolute best at my craft"
- Money: "Build wealth and financial independence"
- Meaning: "Help individual people directly"
- Legacy: "Create something that outlasts me"

════════════════════════════════════════════════════
PART 8: JSON SCHEMA
════════════════════════════════════════════════════

INDIVIDUAL PROFILE:
{
  "version": "1.0",
  "type": "bridges_profile",
  "name": "John",
  "date": "2026-02-28",
  "scores": {
    "drive": 8,
    "social": 5,
    "precision": 4,
    "resilience": 7,
    "vision": 9,
    "ownership": 8,
    "purpose": {
      "mission": 4,
      "mastery": 3,
      "money": 1,
      "meaning": 0,
      "legacy": 2
    }
  },
  "archetype": {
    "id": "commander",
    "title": "The Commander",
    "description": "Drives through vision and decisive action..."
  },
  "answers": {
    "bridge1": [1,1,0,1,1,0],
    "bridge2": [8,4,3,7,5],
    "bridge3": ["Results","Speed","Innovation","Growth","Quality","Process","Stability","Harmony"],
    "bridge4": [2,1,2,1,2],
    "bridge5": [9,8,9,7,10],
    "bridge6": [1,1,1,1,0,1],
    "bridge7": [4,3,1,0,2]
  }
}

TEAM REPORT:
{
  "version": "1.0",
  "type": "bridges_team_report",
  "date": "2026-02-28",
  "profiles": [...],
  "synergy_matrix": [[null,78,45],[78,null,82],[45,82,null]],
  "team_strengths": ["drive","vision"],
  "team_gaps": ["social"],
  "role_recommendations": [...],
  "friction_points": [...],
  "purpose_alignment": 72
}

════════════════════════════════════════════════════
PART 9: IMPLEMENTATION PLAN
════════════════════════════════════════════════════

Build in this exact order:

PHASE 1 — SKELETON (2 hours):
□ Create index.html with embedded <style> and <script>
□ CSS design system: all colors, typography, component styles
□ Screen state machine: welcome, assessment, results, team
□ Navigation logic: showScreen(name), progress tracking
□ Basic responsive layout

PHASE 2 — ASSESSMENT ENGINE (3 hours):
□ Bridge 1: Forced choice component
□ Bridge 2: Custom slider component
□ Bridge 3: Drag-and-drop ranking component
□ Bridge 4: Scenario choice component
□ Bridge 5: Slider (reuse Bridge 2)
□ Bridge 6: Forced choice (reuse Bridge 1)
□ Bridge 7: Point distribution with budget meter
□ All questions populated from data arrays
□ Progress bar tracking
□ Auto-advance on selection
□ Answer storage in state object

PHASE 3 — SCORING & ARCHETYPES (1 hour):
□ Score calculation for each bridge
□ Archetype matching algorithm
□ Purpose split calculation
□ Profile object generation

PHASE 4 — INDIVIDUAL RESULTS (2 hours):
□ Radar chart (Canvas 2D, animated)
□ Bridge breakdown bars (CSS + animated)
□ Archetype card
□ Purpose donut chart (Canvas 2D)
□ JSON export/download

PHASE 5 — TEAM SYNERGY (2 hours):
□ File upload + drag-and-drop
□ Profile cards display
□ Overlay radar chart
□ Synergy matrix calculation + display
□ Strengths, gaps, recommendations text generation
□ Role distribution logic
□ Friction points logic
□ Team report export

PHASE 6 — POLISH (1 hour):
□ Animations: fade transitions, chart draw-in
□ Print styles
□ Error handling (invalid files, etc.)
□ Final design review
□ README.md

TOTAL: ~11 hours of focused work

════════════════════════════════════════════════════
PART 10: CRITICAL REQUIREMENTS
════════════════════════════════════════════════════

1. SINGLE FILE: Everything in one index.html. No external JS or CSS files (except Google Fonts CDN).
2. NO TYPING: The ONLY text input is the optional first name after results. Assessment is 100% click/drag/slide.
3. 7 MINUTES: Test the assessment yourself — if it takes longer, reduce questions.
4. BEAUTIFUL: This is the first thing a potential co-founder sees. If it looks basic, you failed. Premium dark design. Smooth animations. Thoughtful micro-interactions.
5. CORRECT MATH: Synergy scores must make logical sense. Test with edge cases.
6. OFFLINE: Must work without internet (except font loading — provide fallback).
7. EXPORTABLE: JSON files must be valid and re-importable.
8. PRINT-READY: Results and team reports must look good when printed (white background print styles).
```
