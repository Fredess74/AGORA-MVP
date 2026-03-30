# AGORA — Gamma Theme Specification

> **Copy-paste this into Gamma's custom theme settings or use as a reference when building the deck.**

---

## 🎨 COLOR PALETTE

### Core Colors (enter these HEX codes in Gamma)

| Role | Color | HEX | Where to use |
|------|-------|-----|-------------|
| **Primary** | Deep Midnight Navy | `#0A1628` | Slide titles, navigation bar, header backgrounds |
| **Secondary** | Electric Teal | `#00BFA5` | Accents, checkmarks ✅, positive metrics, highlights, key numbers |
| **Accent** | Warm Amber | `#FFB300` | Call-to-action, $ numbers, "attention" callouts, Ask slide |
| **Background** | Clean White | `#FAFBFC` | All slide backgrounds (NOT pure white #FFF — this has slight warmth) |
| **Text Primary** | Near Black | `#1A1A2E` | Body text, descriptions, bullet points |
| **Text Secondary** | Cool Grey | `#6B7280` | Subtitles, captions, source citations |
| **Danger/Problem** | Coral Red | `#EF4444` | ❌ marks, risk indicators, "missing" or "gap" items |
| **Dividers/Borders** | Light Silver | `#E5E7EB` | Table gridlines, card borders, section dividers |

### Why this palette works:

```
  ┌─────────────────────────────────────────────┐
  │  #0A1628 ████████ Deep Navy = TRUST          │
  │  #00BFA5 ████████ Teal = TECHNOLOGY           │
  │  #FFB300 ████████ Amber = ATTENTION           │
  │  #EF4444 ████████ Coral = PROBLEM             │
  │  #FAFBFC ████████ White = CLEAN SPACE         │
  └─────────────────────────────────────────────┘
```

- **Navy (#0A1628)** — Darker than generic blue. Conveys authority, stability, financial trust (FICO association)
- **Teal (#00BFA5)** — Technology signal. Fresh, modern. NOT startup-cliché blue
- **Amber (#FFB300)** — Grabs attention for key numbers ($600M, $10K, $183B). Warm vs. cold palette creates hierarchy
- **Coral (#EF4444)** — Only for "problem" slides: gaps, risks, ❌. Creates emotional contrast
- Contrast ratio Navy-on-White: **14.8:1** (WCAG AAA) — readable at any size/distance

### Gradients (optional, use sparingly)

| Gradient | From → To | Where |
|----------|-----------|-------|
| Hero gradient | `#0A1628` → `#1B3A5C` | Title slide, Conclusion slide backgrounds |
| Tech gradient | `#0A1628` → `#004D40` | Technology slide header |
| Teal highlight | `#00BFA5` at 10% opacity | Card backgrounds for positive metrics |

---

## 🔤 TYPOGRAPHY

### Fonts (all available in Gamma)

| Role | Font | Weight | Size | Fallback |
|------|------|--------|------|----------|
| **Slide Title** | **Inter** | Bold (700) | 40-48px | Helvetica Neue |
| **Subtitle / Insight** | **Inter** | Regular Italic (400i) | 20-24px | Helvetica Neue |
| **Body text** | **Inter** | Regular (400) | 16-18px | Arial |
| **Data / Numbers** | **Space Grotesk** | Medium (500) | 24-32px | Roboto Mono |
| **Source citations** | **Inter** | Regular (400) | 12px | Arial |
| **Navigation bar** | **Inter** | Medium (500) | 11-12px | Helvetica |

### Why Inter + Space Grotesk:

- **Inter** — The industry standard for tech products (GitHub, Figma, Linear). Clean, neutral, high readability. Judges subconsciously associate it with "serious tech company"
- **Space Grotesk** — For large numbers ($600M, $183B, 0.91). Slightly geometric, technical feel. Makes data pop without being Monospace-ugly

### Typography rules:

1. **Max 40 words per slide body** (minus tables). If you can't read it from row 5, it's too small
2. **One font family** (Inter) for everything except hero numbers
3. **Source citations** — always bottom-right, 12px, grey, format: *(Source: Grand View Research, 2024)*
4. **Key number** on each slide should be 32px+ in Amber or Teal

---

## 📐 LAYOUT & SPACING

### Slide structure (every slide)

```
┌──────────────────────────────────────────────┐
│  [AGORA logo, small]              top-right  │
│                                              │
│  TITLE — 40-48px, Bold, Navy                 │
│  Subtitle — 20px, Italic, Grey               │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │                                      │    │
│  │         MAIN CONTENT AREA            │    │
│  │     (charts, tables, diagrams)       │    │
│  │                                      │    │
│  │                                      │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  Insight callout or source citation           │
│                                              │
│ ──────────────────────────────────────────── │
│ Exec  | Problem | Solution | Tech | Market   │
│ Sum   |         |          |      | Opp.     │
│       | Value   | Revenue  | GTM  | Risks    │
│       | Prop    | Model    |      | Concl.   │
└──────────────────────────────────────────────┘
```

### Gamma-specific settings

| Setting | Value |
|---------|-------|
| Card style | **Flat** (no shadows, clean) |
| Card border radius | **8px** (subtle roundness, not bubbly) |
| Card background | `#FFFFFF` for content cards, `#F8FAFC` for data cards |
| Padding | Generous. At least 32px internal padding |
| Layout columns | 2-column for comparisons, 3-column for phases |
| Icons | Minimal. Outlined style only, navy or teal. NO emoji on slides |

---

## 📊 DATA VISUALIZATION

### Chart style (Gamma's built-in charts)

| Element | Style |
|---------|-------|
| Bar charts | Horizontal. Fill: Teal `#00BFA5`. Grid: Light `#E5E7EB` |
| Highlight bar | Amber `#FFB300` for "our" data point |
| Table headers | Navy `#0A1628` bg, white `#FFFFFF` text |
| Table rows | Alternating `#FFFFFF` / `#F8FAFC` |
| Table border | `#E5E7EB`, 1px |
| Comparison ✅/❌ | Teal for ✅, Coral Red for ❌ |

### Callout boxes

| Type | Background | Border-left | Text color |
|------|-----------|-------------|------------|
| Insight / Quote | `#F0FDFA` (teal 5%) | `#00BFA5` 4px | `#1A1A2E` |
| Warning / Problem | `#FEF2F2` (red 5%) | `#EF4444` 4px | `#1A1A2E` |
| Key metric | `#FFFBEB` (amber 5%) | `#FFB300` 4px | `#1A1A2E` |

---

## 🧭 NAVIGATION BAR (bottom of every slide)

```
─────────────────────────────────────────────────────────────
Executive │ Problem │ Solution │ Technology │ Market │ Value │ Revenue │ Adoption │ Risks │ Conclusion
Summary   │         │          │            │ Opp.   │ Prop. │ Model   │ Strategy │       │ & Q&A
─────────────────────────────────────────────────────────────
                     ^^^^^^^^
                     Current slide = Bold + Teal underline
                     Other slides = Grey (#6B7280), Regular
```

- **Purpose:** Judges always know where they are in the narrative. Ferrari-style.
- **Font:** Inter Medium 11px
- **Current slide:** Bold, navy text, teal `#00BFA5` underline 3px
- **Other slides:** Grey `#6B7280`, no underline
- **Separator:** Light grey `#E5E7EB` line above, full width

---

## 🖼️ LOGO USAGE

| Placement | Size | Style |
|-----------|------|-------|
| Every slide, top-right corner | 32×32px | Monochrome navy mark |
| Title slide (Slide 1) | 64×64px | Full color |
| Conclusion slide (Slide 10) | 48×48px | Full color |

---

## 📋 GAMMA SETUP CHECKLIST

When creating the deck in Gamma:

1. **Create new presentation** → Choose "Custom theme"
2. **Set colors:**
   - Primary: `#0A1628`
   - Secondary: `#00BFA5`
   - Accent: `#FFB300`
   - Background: `#FAFBFC`
   - Text: `#1A1A2E`
3. **Set fonts:**
   - Heading: Inter Bold
   - Body: Inter Regular
4. **Card style:** Flat, 8px border radius
5. **Disable** default animations (static, professional)
6. **Page setup:** 16:9 widescreen
7. **Add footer** with navigation bar text on every slide

---

## 🆚 BEFORE vs AFTER (why this is better)

| Aspect | Old (v5.x) | New (v6.0) |
|--------|-----------|------------|
| Primary color | Material Navy `#1a237e` (too purple) | Midnight `#0A1628` (darker, more serious) |
| Accent | Teal `#00897b` (muted) | Electric Teal `#00BFA5` (60% brighter, pops) |
| Numbers | Same color as text | Amber `#FFB300` (dedicated attention color) |
| Background | Pure white `#FFFFFF` (harsh) | Off-white `#FAFBFC` (softer, premium) |
| Font | Unspecified | Inter + Space Grotesk (industry standard) |
| Subtitle style | Not defined | Italic grey insight line (Ferrari-style) |
| Navigation | Not present | Bottom bar on every slide |
| Data visualization | Ad hoc | Systematic: teal positive, coral negative, amber highlight |

---

## 🎯 CONTRAST VALIDATION

| Combination | Ratio | WCAG Rating |
|-------------|-------|-------------|
| Navy `#0A1628` on White `#FAFBFC` | **15.2:1** | ✅ AAA |
| Teal `#00BFA5` on White `#FAFBFC` | **3.1:1** | ⚠️ AA-Large only (use for accents, not body text) |
| Amber `#FFB300` on Navy `#0A1628` | **7.8:1** | ✅ AAA |
| Coral `#EF4444` on White `#FAFBFC` | **3.9:1** | ⚠️ AA-Large (use for icons/marks, not text) |
| Grey `#6B7280` on White `#FAFBFC` | **4.9:1** | ✅ AA |
| White `#FFFFFF` on Navy `#0A1628` | **16.1:1** | ✅ AAA |

> **All text is readable.** Teal and Coral are accent-only (checkmarks, highlights), never body text. Navy and near-black carry all readable content.
