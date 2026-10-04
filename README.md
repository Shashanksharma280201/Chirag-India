# Chirag Indians — website

A single-page HTML/CSS/JS website. No build step, no framework.

## Run it locally

```bash
cd site
python3 -m http.server 8000
```

Then open http://localhost:8000. Or just double-click `index.html`.
The site is deployed from the `main` branch of the GitHub repo.

## Files

| Path             | What it is                                              |
|------------------|---------------------------------------------------------|
| `index.html`     | The whole site: hero → the problem → myths → featured story → who we are → donate your eyes → FAQ → how campaign works → stories gallery |
| `css/style.css`  | All styling. Colours and fonts are variables at the top. |
| `js/main.js`     | Nav, gallery filters, lightbox. Contact details live in the `SITE` block at the top. |
| `assets/`        | Logo, web-sized photos (`img/<album>/`), transcoded videos (`video/`). |
| `about.html` etc.| Tiny redirect stubs so old links still land on the right section. |

Every **Pledge Now** button links to the official NOTTO Donor Pledge Portal
(https://notto.mohfw.gov.in/). There is no pledge form on the site.

## Changing colours or fonts

Edit the variables in `:root` at the top of `css/style.css`:

- `--teal`, `--teal-deep`, `--teal-dark` — primary colour and dark sections
- `--amber` — accent / call-to-action buttons
- `--cream`, `--sand` — page and alternate section backgrounds
- `--font-display`, `--font-body` — heading and body fonts (Google Fonts link is in the `<head>` of `index.html`)

## Still to fill in

**Contact details** — the `SITE` block at the top of `js/main.js`:
WhatsApp number and email are placeholders. The helpline is NOTTO's toll-free
1800-11-4770.

**Media still missing.** Each spot in `index.html` is a dashed box with a
label; search the file for `asset-slot` and `ASSET NEEDED`.

| Where                | What to add                                                        |
|----------------------|--------------------------------------------------------------------|
| How campaign works   | The video advertisement (the 6 ads) — save as `assets/video/campaign-ads.mp4`, ideally under ~15 MB; a still from it is already used as the poster |
| Stories gallery      | Sister award presentation, Marwari Samaj photograph                |
| Hero                 | The "children praying" photo, if still wanted (a school pledge photo is used now) |

To place the video, replace the dashed box in the campaign section with
`<video controls playsinline poster="assets/img/campaign/video-poster.jpg" src="assets/video/campaign-ads.mp4"></video>`.

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
filter chips use. For a video, use `class="pin pin--video"`, point `href` at the
`.mp4`, add `data-poster="…jpg"`, and use the poster image as the `<img>`.
