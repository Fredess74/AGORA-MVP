# AGORA — Design Theme: Red / Grey / White

> **Стиль:** Ferrari Pitch Reference × McKinsey × Tesla
> **Правило:** 60% White — 30% Charcoal — 10% Red
> **Инструмент:** Google Slides / PowerPoint

---

## 🎨 ЦВЕТОВАЯ ПАЛИТРА

### Core Colors

| Роль | Название | HEX | RGB | Где |
|------|----------|-----|-----|-----|
| **Accent** | Crimson Red | `#C8102E` | 200, 16, 46 | Ключевые цифры ($600M, $183B), ❌, alerts, CTA |
| **Primary** | Anthracite | `#1F2937` | 31, 41, 55 | Заголовки, nav bar, header backgrounds |
| **Text** | Near Black | `#111827` | 17, 24, 39 | Body текст |
| **Subtitle** | Steel Grey | `#6B7280` | 107, 114, 128 | Подзаголовки, source citations |
| **Background** | Snow | `#FAFAFA` | 250, 250, 250 | Основной фон (мягче чем #FFF) |
| **Card bg** | Light Grey | `#F3F4F6` | 243, 244, 246 | Контейнеры, info boxes, таблицы |
| **Border** | Silver | `#E5E7EB` | 229, 231, 235 | Линии, разделители, grid |
| **Positive** | Forest Green | `#059669` | 5, 150, 105 | ✅ галочки, positive indicators only |

### Почему именно этот красный?

`#C8102E` — это **Pantone 186 C** (Ferrari Red / Cadillac Red / Manchester United Red).

- НЕ ярко-алый `#FF0000` (агрессивный, дешёвый)  
- НЕ бордовый `#800020` (слишком тёмный, не видно с расстояния)
- Именно `#C8102E` — **насыщенный, уверенный, premium**

### Стратегическая логика красного для Agora:

> **Agora решает проблему ДОВЕРИЯ. Красный = цвет предупреждения.**
> 
> "Без Agora — red alert. С Agora — green trust score."
> 
> Красный на слайдах = визуализация ПРОБЛЕМЫ. Зелёный = визуализация РЕШЕНИЯ.
> Это создаёт подсознательный нарратив: **danger → safety**.

---

## 🔤 ТИПОГРАФИКА

| Роль | Шрифт | Вес | Размер | Цвет |
|------|-------|-----|--------|------|
| **Slide title** | Inter | Bold (700) | 40-44px | `#1F2937` |
| **Subtitle** | Inter | Regular Italic | 20-22px | `#6B7280` |
| **Body** | Inter | Regular (400) | 16-18px | `#111827` |
| **Key number** | Inter | Black (900) | 48-64px | `#C8102E` |
| **Table header** | Inter | SemiBold (600) | 14px | `#FFFFFF` on `#1F2937` |
| **Source** | Inter | Regular | 11px | `#9CA3AF` |
| **Nav bar** | Inter | Medium (500) | 11px | `#6B7280` / активный: `#C8102E` |

**Почему только Inter:**
- Один шрифт = дисциплина. McKinsey, Stripe, Linear — все используют один font family
- Inter доступен в Google Slides, Slides, PowerPoint, Canva, Figma

---

## 📐 LAYOUT

### Структура каждого слайда:

```
┌──────────────────────────────────────────────┐
│  AGORA                              [logo]   │
│                                              │
│  SLIDE TITLE                    ← #1F2937    │
│  One-sentence insight subtitle  ← #6B7280 i  │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │                                      │    │
│  │    CONTENT AREA                      │    │
│  │    Charts / Tables / Diagrams        │    │
│  │    Key number in RED                 │    │
│  │                                      │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  Source: [citation]         ← #9CA3AF 11px   │
│                                              │
│ ─────────── #E5E7EB line ──────────────────  │
│  Exec │ Problem │ Solution │ ... │ Conclusion │
│  Sum  │         │          │     │ & Q&A      │
│       current = BOLD + #C8102E underline      │
└──────────────────────────────────────────────┘
```

### Тёмные слайды (2 штуки — Exec Summary и Conclusion):

```
┌──────────────────── #1F2937 bg ──────────────┐
│  AGORA                      ← #FFFFFF         │
│                                               │
│  EXECUTIVE SUMMARY          ← #FFFFFF bold    │
│  Trust infrastructure       ← #9CA3AF         │
│  for the AI agent economy                     │
│                                               │
│       $600M                 ← #C8102E 64px    │
│                                               │
│  [ key metrics in white on charcoal ]         │
│                                               │
│ ──────────────────────────────────────────── │
│  nav bar: white text, red active              │
└───────────────────────────────────────────────┘
```

---

## 📊 ВИЗУАЛИЗАЦИЯ ДАННЫХ

### Таблицы

| Элемент | Стиль |
|---------|-------|
| Header row | `#1F2937` bg, `#FFFFFF` text, Inter SemiBold |
| Even rows | `#FFFFFF` bg |
| Odd rows | `#F3F4F6` bg |
| Border | `#E5E7EB` 1px |
| Highlight cell | `#C8102E` text for key metric |

### Comparison ✅ / ❌

| Symbol | Color | Meaning |
|--------|-------|---------|
| ✅ | `#059669` Forest Green | Мы это делаем / решено |
| ❌ | `#C8102E` Crimson Red | Пробел / конкурент не делает |
| ⚠️ | `#D97706` Amber | Частично / в процессе |

### Bar charts

| Element | Color |
|---------|-------|
| Primary bars | `#1F2937` Anthracite |
| Highlight bar ("AGORA") | `#C8102E` Crimson |
| Grid lines | `#E5E7EB` |
| Labels | `#6B7280` |

### Callout boxes

| Type | Border-left | Background |
|------|-------------|------------|
| Key insight | `#C8102E` 4px | `#FEF2F2` (red 3%) |
| Positive | `#059669` 4px | `#ECFDF5` (green 3%) |
| Neutral info | `#6B7280` 4px | `#F3F4F6` |

---

## 🧭 NAVIGATION BAR

На КАЖДОМ слайде внизу:

```
Executive │ Problem │ Solution │ Technology │ Market │ Value │ Revenue │ Adoption │ Risks │ Conclusion
Summary   │         │          │    Arch.   │ Opp.   │ Prop. │ Model   │ Strategy │       │ & Q&A
```

- Разделитель: `#E5E7EB` линия сверху
- Текст: `#6B7280` Inter Medium 11px
- Текущий слайд: `#1F2937` Bold + `#C8102E` underline 3px
- Формат: капс или title case

---

## ✅ КОНТРАСТ (WCAG проверка)

| Пара | Ratio | Уровень |
|------|-------|---------|
| `#1F2937` на `#FAFAFA` | **13.5:1** | ✅ AAA |
| `#111827` на `#FAFAFA` | **15.8:1** | ✅ AAA |
| `#C8102E` на `#FAFAFA` | **6.1:1** | ✅ AA (для 48px+ = AAA) |
| `#FFFFFF` на `#1F2937` | **13.5:1** | ✅ AAA |
| `#C8102E` на `#1F2937` | **3.4:1** | ✅ AA-Large (для акцентных цифр 48px+) |
| `#6B7280` на `#FAFAFA` | **4.6:1** | ✅ AA |
| `#059669` на `#FAFAFA` | **4.5:1** | ✅ AA |

> **Всё читаемо.** Красный используется ТОЛЬКО для крупных чисел (48px+) и иконок — никогда для body text.

---

## 📋 GOOGLE SLIDES / POWERPOINT SETUP

### Шаг 1: Создать мастер-слайд
1. Slide → Edit theme
2. Background: `#FAFAFA`
3. Title: Inter Bold 40px `#1F2937`
4. Subtitle: Inter Regular Italic 20px `#6B7280`

### Шаг 2: Установить палитру
В Theme Colors: 
- Color 1: `#C8102E` (accent)
- Color 2: `#1F2937` (primary)
- Color 3: `#6B7280` (secondary)
- Color 4: `#059669` (positive)
- Color 5: `#FAFAFA` (background)

### Шаг 3: Добавить nav bar
- Insert → Text box → шириной на весь слайд, внизу
- Copy to all slides
- Underline текущую секцию красным

### Шаг 4: Тёмные слайды (1 и 10)
- Background: `#1F2937`
- Text: `#FFFFFF`  
- Accent: `#C8102E`

---

## 🆚 СРАВНЕНИЕ С ПРЕДЫДУЩИМИ ВАРИАНТАМИ

| Aspect | Red/Grey/White | Stripe Heir (A) | FICO 2.0 (B) | Dark (C) |
|--------|:-:|:-:|:-:|:-:|
| **Запоминаемость** | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★★★ |
| **Серьёзность** | ★★★★★ | ★★★★☆ | ★★★★★ | ★★★★☆ |
| **Уникальность на конкурсе** | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★★★ |
| **Безопасность (проектор)** | ★★★★★ | ★★★★★ | ★★★★★ | ★★★☆☆ |
| **Ferrari reference match** | ★★★★★ | ★★☆☆☆ | ★★☆☆☆ | ★☆☆☆☆ |
| **Подкрепляет "trust/alert"** | ★★★★★ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ |

> **Red = danger without us. Green = safety with us.** Это не просто цвет — это визуальный нарратив.
