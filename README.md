# Chirag India — website

A single-page HTML/CSS/JS website. No build step, no framework.

## Run it

```bash
cd site
python3 -m http.server 8000
```

Then open http://localhost:8000. Or just double-click `index.html`.
To go live, upload the contents of `site/` to any static host.

## Files

| Path             | What it is                                              |
|------------------|---------------------------------------------------------|
| `index.html`     | The whole site (hero → problem → how it works → myths → impact → story → who we are → donate → FAQ → join → stories → pledge form) |
| `css/style.css`  | All styling. Colours and fonts are variables at the top. |
| `js/main.js`     | Nav, counters, gallery filters, lightbox, form handling. Contact details and numbers live in the `SITE` block at the top. |
| `assets/`        | Logo, web-sized photos (`img/<album>/`), transcoded videos (`video/`). |

## Changing colours or fonts

Edit the variables in `:root` at the top of `css/style.css`:

- `--teal`, `--teal-deep`, `--teal-dark` — primary colour and dark sections
- `--amber` — accent / call-to-action buttons
- `--cream`, `--sand` — page and alternate section backgrounds
- `--font-display`, `--font-body` — heading and body fonts (Google Fonts link is in the `<head>` of `index.html`)

## Things to fill in before going live

All contact details and numbers are in **one place**: the `SITE` block at the
top of `js/main.js`.

1. **Helpline number, WhatsApp number, email** — replace the `00000` placeholders.
2. **Impact numbers** (eyes pledged, families reached, corneas donated).
3. **Pledge form delivery** — pick one:
   - *Recommended:* create a free form at <https://formspree.io>, copy the
     endpoint (looks like `https://formspree.io/f/abcdwxyz`) into `formEndpoint`.
     Submissions arrive by email.
   - *Or* leave `formEndpoint` empty. The form then opens WhatsApp with the
     details pre-filled and the person taps "send".
4. The amber banner in the "Who we are" section has `[year]`, `[founder]` and `[X] cities`.
5. The trust-markers row has placeholder chips for partner eye bank logos and
   government recognition. Replace with `<img>` logos.
6. The featured story cite says "A pledger" — put the real name and city.
7. The hero photo is a school pledge photo. The brief asked for the "children
   praying" photo — save it as `assets/img/hero.jpg` and change the `<img src>`
   in the hero section.
8. The gallery has "Photos coming soon" tiles for albums that had no photos in
   the source folders: Marwari Samaj photograph, President memento, Sister
   award presentation, DC presentation, Poster movement, Featured ad with Roshni.
   Delete those tiles once real photos are added.

## Adding a photo to the gallery

Save the photo (max ~1600px wide) as `assets/img/<album>/NN.jpg` and a smaller
copy (max ~720px) as `assets/img/<album>/thumb/NN.jpg`. Then add a tile inside
`<div class="masonry">` in `index.html`:

```html
<a class="pin" data-cat="ground" href="assets/img/<album>/NN.jpg" data-caption="Short caption">
  <img src="assets/img/<album>/thumb/NN.jpg" alt="What's in the photo" loading="lazy" width="720" height="540">
  <span class="pin__cap"><small>On ground</small>Short caption</span>
</a>
```

`data-cat` must be one of `ground`, `recognition`, `spreading` — that's what the
filter chips use. `width`/`height` should match the thumbnail's real size so the
wall doesn't jump while loading.

For a video, use `class="pin pin--video"`, point `href` at the `.mp4`, add
`data-poster="…jpg"`, and use the poster image as the `<img>`.

## Assets

- Originals are untouched in the parent folder; `assets/img/` holds web copies.
- `assets/video/public-fridge.mp4` is the largest file (12 MB). Remove its tile
  from `index.html` if page weight matters.
