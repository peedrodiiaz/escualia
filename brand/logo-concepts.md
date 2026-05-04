# Escualia — Logo Concept Directions

**Brief context**: Escualia is a SaaS B2B for Spanish driving schools. The audience is
autonomous owners and small-to-medium school operators — practical people, not tech
enthusiasts. The logo must communicate: modernity, reliability, Spanish market proximity,
and the promise of simplifying a complex operation.

**Non-negotiables across all directions**:
- Works at 16px (favicon) and 500px (OG image) without degradation
- One-color version must be legible on white and on brand-blue (#2563EB)
- No more than 2 colors in the full-color version
- Wordmark uses Geist or a geometric sans-serif (aligns with existing stack)
- No car-front icon, no steering wheel — those are cliche in the category

---

## Direction 1 — "Ruta completada"

### Concept
A minimalist road mark that transforms into a checkmark. The idea is literal but
executed with restraint: the journey (learning to drive) ends at a destination
(passing the exam). The orange accent dot at the endpoint is the moment of triumph.

The current SVG logo in `logo.tsx` is already pursuing this direction — Direction 1 is
a refinement brief to elevate that concept into a more polished identity.

### Form language
- Geometric, rounded corners (rx = 10 on the bounding square matches the existing logo)
- Road curve in white/light on blue background — negative space is the feature
- Checkmark endpoint uses the accent orange (#F97316) as a contrasting dot/circle
- Single weight stroke — no fills inside the road path
- The mark reads as "path to success" without needing the road context

### Refinement instructions for designer
1. Reduce the road curve from 3 inflection points to 2 — cleaner gesture
2. The start dot (bottom-left) should feel like a "here" pin, not a random circle
3. The destination circle (top-right) should be 20-25% of mark area — dominant
4. Consider making the checkmark a single diagonal stroke instead of a V — more confident
5. Test without the background square — mark only — to ensure it reads independently

### Midjourney / DALL-E prompt
```
Minimal geometric logo mark, white road curve on blue square background with orange
checkmark circle at endpoint, rounded corners, single weight stroke, flat design,
no gradients, SVG-style, 1:1 aspect ratio, white background outside the mark
```

### Visual references (existing brands with similar resolution)
- **Notion** (N mark): negative space + geometric simplicity on colored square
- **Linear** (orbit mark): single-weight vector on colored background
- **Stripe** (S mark): diagonal energy, brand color as background, white mark

---

## Direction 2 — "Escuela como institución"

### Concept
Escualia positioned as a trustworthy institution, not a startup. The mark is a shield
or badge form — a nod to the official DGT aesthetic — but completely modernized.
Inside the badge: a steering wheel abstracted into 3 spokes forming an "E" or an
upward-pointing chevron.

This direction targets the franchise and multi-school segment: operators who want to
present a professional, credibility-first image to their own students and staff.

### Form language
- Hexagonal or rounded-triangle shield silhouette
- Interior mark: abstract 3-spoke form that reads as both a wheel and the letter E
- Color split: shield body in brand blue (#2563EB), interior accent lines in white,
  optional orange accent on the top vertex of the shield
- Wordmark: wider letter-spacing (0.05–0.08em), medium weight — institutional feel
- Name casing: ESCUALIA in all-caps, or "Escualia" with heavier weight on the E

### Refinement instructions for designer
1. The shield form must NOT look like a police badge — keep it architectural
2. Interior spoke spacing: equal thirds radiating from a center point
3. Top vertex of shield is the "destination" — orange dot or just a notch
4. Test on light and dark backgrounds: shield needs a thin (1px) border on light bg
5. Wordmark should sit below the mark, not beside it — stacked lock-up is primary

### Midjourney / DALL-E prompt
```
Modern hexagonal shield logo mark, blue background, white three-spoke abstract wheel
design inside shield, clean geometric, institutional SaaS brand, flat design,
no gradients, minimal, white background, 1:1 square canvas
```

### Visual references
- **Shopify** (bag mark): shield-adjacent geometric form, single color dominance
- **Atlassian** (old mark): institutional reliability through geometric symmetry
- **Milanote** (shield variant): modern take on institutional badge without stuffiness

---

## Direction 3 — "La A de Autoescuela"

### Concept
A typographic mark built around the letter "A" — the universal initial of
"Autoescuela" in Spanish. The A is redrawn so its crossbar is a road line (dashed),
and the negative triangle inside the A reads as a windshield or forward arrow.

This direction is the most typographic and the most versatile. It works standalone as
a monogram (app icon, favicon) and pairs with the full wordmark as a second lock-up.

The brand story: the A is the first letter of the journey. Every autoescuela starts
with an A. Escualia gives that A new meaning.

### Form language
- Geometric sans A — constructed from straight lines and circular arcs (not calligraphic)
- The crossbar is replaced by a dashed line — road center line metaphor, 3 dashes
- The counter (negative triangle inside A) has a subtle upward-pointing chevron or
  forward arrow, reinforcing progression
- No serifs, no shadow, no bevel
- Full-color: A in brand blue (#2563EB), dashes in orange (#F97316)
- Monochrome: single flat color — all details hold at monochrome

### Refinement instructions for designer
1. A proportions: width-to-height ratio 0.85:1 — slightly wide to feel stable
2. Stroke weight: consistent 3–4% of height — not ultra-thin
3. Dashed crossbar: exactly 3 dashes, gaps wider than the dashes (ratio 1:1.5)
4. Counter arrow: single-pixel stroke inset into the counter, pointing up-right
5. The mark stands alone at 32×32px without the wordmark — test this first

### Midjourney / DALL-E prompt
```
Geometric letter A logo mark, bold clean construction, dashed center crossbar as
road line, small upward arrow inside counter triangle, brand blue and orange accent,
flat vector, no gradients, no shadows, SaaS minimalist style, white background, 1:1
```

### Visual references
- **Airbnb** (Belo): letter-form with embedded meaning — the mark tells the story
- **Figma** (F mark): typographic mark that functions as standalone icon
- **Webflow** (W mark): geometric construction from a letter, works at all sizes

---

## Choosing a direction — Decision matrix

| Criterion                | Dir 1 — Ruta | Dir 2 — Escudo | Dir 3 — La A |
|--------------------------|:------------:|:--------------:|:------------:|
| Works at 16px favicon    | Medium       | Low            | High         |
| Differentiates in market | Medium       | High           | Medium       |
| Matches current brand    | High         | Low            | Medium       |
| Scales to franchise tier | Medium       | High           | High         |
| Designer effort          | Low (refine) | Medium         | High         |
| Startup-to-institution path | Start here | End goal      | Parallel track|

**Recommendation**: Start with Direction 1 (refine current mark — low cost, high
continuity), queue Direction 3 (typographic A) as the v2 mark when product matures,
and commission Direction 2 as a franchise-specific variant for the multi-sede tier.

---

## File naming convention for deliverables

When the designer delivers assets, request them in this structure:

```
brand/
  logo/
    escualia-logo-full.svg          (horizontal lock-up)
    escualia-logo-stacked.svg       (stacked lock-up)
    escualia-mark.svg               (mark only)
    escualia-mark-monochrome.svg    (single color)
    escualia-mark-white.svg         (for dark backgrounds)
    escualia-wordmark.svg           (text only, no mark)
    escualia-favicon.svg            (16px optimized)
    escualia-og-image.png           (1200×630, for social sharing)
```
