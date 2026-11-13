# Ép — fresh juice, ordered online, in the Fizz template

The owner chose **Fizz** by looking at it (`design/template.jpg`): lime on
sunlit photographs, a handwritten word across every heading, everything
rounded. There is no direction left to choose. This file says how a juice
shop that sells online sits in it.

## The business, in two lines each

- **What it sells, to whom.** Fresh, cold-pressed fruit and vegetable juice
  in bottles, ordered online by people in the owner's city.
- **The one action.** Put bottles in the bag and pay online. The second
  action is to call or send a message.
- **What exists.** Nothing but the brief: no name, no logo, no menu, no
  prices, no photographs, no address or phone. So the menu is crawled from
  real cold-press shops (below), the scenes are stock, and every contact
  detail is left empty for the owner.
- **Currency.** The brief is Vietnamese: VND, written `85.000 ₫`, locale
  `vi-VN`.

## The name

The owner gave none and the description names no business. **Ép** — the
Vietnamese word for *pressed*, the word on every juice stall in the country
(*nước ép* is pressed juice). Two letters in Anton capitals hold the header
the way ZESTÓ holds the template's. The mark beside it is a citrus slice,
drawn in `LogoMark.tsx` and used as `favicon.svg`.

## Where the records come from

- **Morico at Home**, Ho Chi Minh City — cold-pressed 250 ml bottles with
  their own ingredients and VND prices:
  https://morico-at-home.myshopify.com/collections/cold-pressed-juice .
  Green Booster (105.000 ₫, "keeps 5 days in the fridge") is kept. Tropical
  Glow, Antioxidant and Daily Vitamin were crawled with their pictures and
  then dropped at the first crit: they are glass bottles photographed on a
  grey wall, which cannot be cut out, and in a grid of cut-out bottles they
  filled their tiles edge to edge at twice the scale of the rest.
- **Pressed Juicery** — eight 450 ml cold-pressed bottles, shot as clean
  pack-shots with an ingredients picture and a lifestyle picture each:
  https://pressed.com/collections/juices . Listed at US$6.95; converted at
  about 26.000 ₫ to the dollar and rounded to **180.000 ₫**, with the
  page's own figure kept in the hidden `price_listed`.
- Maison Marou's fresh orange juice (https://maisonmarou.com/products/fresh-orange-juice)
  was read and dropped: its only picture is a glass beside a croissant in a
  café, not a bottle.

Nine bottles, three kinds — **Fruit**, **Greens**, **Roots & spice** — three
of each, so every grid fills its rows. Every picture is borrowed from the
bottle's own page (`public/images/ref/`) and is replaced by the owner's own
bottles before the site goes online.

## What moved from the template, and why

- **Hues: kept.** Lime `#C5EB00` on deep bottle green `#002F1F` over white
  is already the colour of a green juice; re-tinting it would have made the
  shop look less like what it sells. `--accent-soft` `#F7FBE2` added for the
  pale band, as the template asks.
- **The sky behind a flavour: one pale tile.** The template stands each can
  on a blue-sky photograph. Here every bottle is cut out and stands on ONE
  flat pale sky, `--product-ground` `#DCEBF5` (and `--product-photo-ground`
  set to the same, so a glass bottle the owner photographs later lands on
  the same ground). One grid, one ground, one scale.
- **Faces: kept.** Anton 400 capitals, Inter 400 for reading, Caveat for
  the three or four handwritten words. The template is drawn in heavy
  condensed capitals and is built in them; that is the first unlock below.
- **Shape and scale: kept.** 16px cards, 10px inputs, pills everywhere,
  h1 64px and h2 44px at 1440.

## The two unlocks (the direction's, carried through every page)

1. **The headings are Anton capitals, heavier and tighter than house
   style's 400–500 sans** — because the template the owner chose is drawn in
   them, and a juice label is set in exactly this kind of condensed poster
   capital.
2. **Motion beyond moderate (showpiece)** — the owner chose it on the form:
   one band that runs by itself, the ghosted words drifting with the scroll,
   magnetic primary buttons, a count, and one held section.

## Which device carries which thing

| Template device | What it holds here | Component |
|---|---|---|
| GHOSTED WORD | `SQUEEZED` across the hero photograph; `PRESSED` closing the footer | `pages/Home.tsx` Hero, `SiteFooter.tsx` |
| FLOATING PRODUCT CARD | the first two bottles over the hero's lower corners; the order's total on the confirmation photograph; the contact details on the contact photograph | `ProductCard floating`, `pages/Order.tsx`, `pages/Contact.tsx` |
| SCRIPT OVERLAY | three or four handwritten words across the end of every section heading on every page — bright lime on photographs, olive-lime (`--script-ink`) on white so it reads | `Script.tsx` |
| ACCENT PILL | every call to action — Shop, Add to bag, Check out, Pay — with its round glyph; the round version adds a bottle from a card | `Pill.tsx`, `ProductCard.tsx` |
| CHIP LABEL | each bottle's lead fruit on its card; the kind and bottle-size filters on the shop; the ingredients on a bottle's page | `ProductCard.tsx`, `pages/Shop.tsx`, `pages/Product.tsx` |
| TESTIMONIAL CARD | no reviews exist, so the three cards on the pale band carry the shop's own handling notes (shake it, keep it cold, drink it soon) — a photograph, a lime quote mark, two lines, and no invented customer | `pages/Home.tsx` Notes |

## Section order, home

strip → hero with the ghosted word and two floating cards → **the flavours,
held while the row passes** → a lime band of ingredients that runs by itself
→ the notes on the pale band → the photographic call to action → "write to
us" row → footer with `PRESSED` set enormous.

- **Reviews band → notes.** There are no reviews; the band stays, carrying
  handling notes that are true of any fresh juice.
- **Subscribe row → write-to-us row.** The brief has no newsletter; it does
  have "a way to call or message", so the row sends people to the form.

## What the template has that this build cannot make

- **Designed packaging shot in water.** There is no packaging yet. The
  bottles are each shop's own pack-shots, standing on pale sky; no splash
  is faked.
- **People holding the product in the hero.** The hero is a stock photograph
  of a glass of orange juice held out to the camera in sunlight — the product
  being enjoyed, not this shop's bottle. It is named for replacement.

## THE PAGES NOBODY DREW

### /shop
- **Who arrives:** somebody who knows they want juice and is choosing which
  bottle — by kind (fruit, greens, roots) and by bottle size.
- **First screen at 1440×790:** a photograph band of cut tropical fruit with
  the heading and the count on it is the largest thing; under it the chips,
  then the first row of three bottles with their price.
- **The look:** CHIP LABEL as the filters (kind, bottle size) and on every
  card; SCRIPT OVERLAY across the heading on the band; ACCENT PILL as the
  round add button.
- **From what I looked at:** https://pressed.com/collections/juices — a
  count at the left, the kinds as one row of words to narrow by, one tile
  colour for every bottle, a line under each name saying what is in it.
  https://baymard.com/mcommerce-usability/benchmark/mobile-page-types/product-page —
  the benchmark's gallery of list and product pages: the card must carry
  enough to choose without opening it (here: size and ingredients).

### /shop/:id
- **Who arrives:** somebody deciding on one bottle: what is in it, how big,
  how long it keeps, what it costs.
- **First screen:** the bottle LARGE on the pale sky tile, half the screen,
  with its other pictures under it; at the right the kind chip, the name in
  capitals with a script line, the price set large in Anton, the size, the
  ingredient chips, the quantity and the lime pill.
- **The look:** CHIP LABEL for every ingredient; SCRIPT OVERLAY on the
  name; ACCENT PILL as the add button; the ingredients as a pale band.
- **From what I looked at:** https://pressed.com/products/celery-juice —
  pictures left (bottle, ingredients cut out, lifestyle), name, one line of
  what is in it, price, add; then a band of what it is, then related bottles.
  https://baymard.com/mcommerce-usability/benchmark/mobile-page-types/product-page —
  more than one picture, the specifics a buyer compares by set out as a
  table, related products last.

### /bag
- **Who arrives:** somebody checking what they chose before paying.
- **First screen:** the heading with its script, the lines — picture tile,
  name, size, unit price, stepper, line total right-aligned, remove — and
  the summary card with the total and the lime pill. Empty: the same heading
  and three bottles to start with.
- **The look:** SCRIPT OVERLAY on the heading; ACCENT PILL to check out;
  the bottles on the same pale sky tile as the shop.
- **From what I looked at:** https://baymard.com/checkout-usability/benchmark/step-type/cart —
  thumbnails, quantity that changes, remove, a total that says what it does
  not yet include. https://dribbble.com/search/checkout-page — the summary
  as one coloured card at the right, the total as the largest figure.

### /checkout
- **Who arrives:** somebody ready to pay.
- **First screen:** three numbered steps (contact, delivery, payment — a real
  sequence) at the left; at the right the order with pictures, subtotal,
  delivery, and the total in Anton, then the Pay pill that names the amount.
- **The look:** ACCENT PILL as Pay; CHIP-like marked options for delivery
  and payment, each with its icon; SCRIPT OVERLAY on the heading.
- **From what I looked at:** https://baymard.com/checkout-usability/benchmark/step-type/payment —
  payment chosen from marked options, never typed; the order in view while
  paying. https://dribbble.com/search/checkout-page — form left, summary
  card right, the pay button inside the summary.

### /order
- **Who arrives:** somebody who has just paid.
- **First screen:** the answer first and largest — ORDER PLACED with its
  number — then the steps as one line with where it is now, beside a sunlit
  photograph with a floating white card carrying the total.
- **The look:** FLOATING PRODUCT CARD (the total over the photograph);
  SCRIPT OVERLAY on the answer; ACCENT PILL back to the shop.
- **From what I looked at:** https://baymard.com/checkout-usability/benchmark/step-type/receipt —
  order number, what was bought with pictures, where it goes, how it was
  paid, who to ask. https://dribbble.com/search/order-tracking-page — the
  status as one horizontal line of steps with the current one marked.

### /contact
- **Who arrives:** somebody with a question about an order, or who would
  rather message than pay online.
- **First screen:** the heading with its script and the form at the left; at
  the right a tall sunlit photograph with a floating white card carrying the
  ways to reach the shop (drawn only for the details the owner fills in).
- **The look:** FLOATING PRODUCT CARD (contact details over the photograph);
  SCRIPT OVERLAY on the heading; ACCENT PILL to send.
- **From what I looked at:** https://dribbble.com/search/contact-page — the
  ways to reach a business beside the form, never under it; one picture
  carrying the page.

### /admin/sign-in
- **Who arrives:** the owner, to run the shop.
- **First screen:** the scaffold's sign-in screen in the management palette.
- **The look:** this is the door to the management area, which keeps its own
  neutral look by rule; the name and the mark are the only things of Ép on it.
- **From what I looked at:** https://dribbble.com/search/login-page — a
  reason to be there beside two fields; kept as the scaffold draws it.

## COMMITMENTS

1. A thin lime strip runs across the very top of every page carrying one line in small capitals.
2. The home page opens on one bright photograph of juice being enjoyed, with SQUEEZED set in white capitals across its whole width, half-transparent, and a handwritten lime line over it.
3. Two small white rounded cards float over the hero photograph's lower corners, each with a bottle on pale sky, its name, its price and a round lime button.
4. Every section heading on every page is Anton capitals with three or four handwritten words tilted across its end — bright lime on a photograph (with a deep-green shadow), an olive-lime `--script-ink` on white and on the pale band so it reads at 3:1.
5. Every bottle on the site stands on the same flat pale-sky tile, with its lead fruit on a small lime chip at the tile's top right.
6. On the home page at 1024px and wider, the flavours section holds the screen while its row of bottles passes sideways (the seven not already on the hero's cards).
7. A lime band of ingredient names runs by itself across the home page, between the flavours and the notes.
8. The footer ends on PRESSED set in deep green capitals as wide as the page and cut off by its bottom edge.
