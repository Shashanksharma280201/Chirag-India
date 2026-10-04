/* ==========================================================================
   Chirag Indians — site script
   --------------------------------------------------------------------------
   EDIT THE `SITE` BLOCK BELOW to update contact details. The page reads from
   it, so you only change it in one place.
   ========================================================================== */

const SITE = {
  // Emergency helpline shown on the Donate section + footer (NOTTO toll-free)
  helpline: "1800-11-4770",
  helplineTel: "18001144770",

  // NGO contact (placeholders — replace with real values)
  whatsapp: "910000000000",             // WhatsApp number in international format, digits only
  email: "hello@chiragindians.in",      // contact email

  // Previous website, mentioned in "Who we are"
  website: "chiragindia.co.in",
  youtube: "https://www.youtube.com/@AapKeJazbaaat",

  // Official pledge portal — every "Pledge Now" button links here
  notto: "https://notto.mohfw.gov.in/",
};

/* --------------------------------------------------------------------------
   Fill in [data-site] placeholders
   -------------------------------------------------------------------------- */
(function fillSiteData() {
  const map = {
    helpline: SITE.helpline,
    email: SITE.email,
    website: SITE.website,
    year: String(new Date().getFullYear()),
  };
  document.querySelectorAll("[data-site]").forEach((el) => {
    const key = el.getAttribute("data-site");
    if (key in map) el.textContent = map[key];
  });
  document.querySelectorAll("[data-site-href]").forEach((el) => {
    const key = el.getAttribute("data-site-href");
    if (key === "tel") el.setAttribute("href", "tel:" + SITE.helplineTel);
    if (key === "mail") el.setAttribute("href", "mailto:" + SITE.email);
    if (key === "whatsapp") el.setAttribute("href", "https://wa.me/" + SITE.whatsapp);
    if (key === "notto") el.setAttribute("href", SITE.notto);
  });
})();

/* --------------------------------------------------------------------------
   Mobile nav
   -------------------------------------------------------------------------- */
(function nav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
})();

/* --------------------------------------------------------------------------
   Reveal on scroll
   -------------------------------------------------------------------------- */
(function reveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach((el) => io.observe(el));
})();

/* --------------------------------------------------------------------------
   Lightbox for .collage links (images + videos)
   -------------------------------------------------------------------------- */
(function lightbox() {
  const links = Array.from(document.querySelectorAll(".masonry a.pin:not(.pin--placeholder), a[data-lightbox]"));
  if (!links.length) return;

  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Photo viewer");
  box.innerHTML = `
    <button class="lightbox__close" aria-label="Close">×</button>
    <button class="lightbox__prev" aria-label="Previous">‹</button>
    <div class="lightbox__stage"><div class="lightbox__media"></div><div class="lightbox__cap"></div></div>
    <button class="lightbox__next" aria-label="Next">›</button>`;
  document.body.appendChild(box);

  const media = box.querySelector(".lightbox__media");
  const cap = box.querySelector(".lightbox__cap");
  let group = [];
  let idx = 0;
  let lastFocus = null;

  const render = () => {
    const a = group[idx];
    media.innerHTML = "";
    if (a.classList.contains("pin--video")) {
      const v = document.createElement("video");
      v.src = a.getAttribute("href");
      v.controls = true; v.autoplay = true; v.playsInline = true;
      if (a.dataset.poster) v.poster = a.dataset.poster;
      media.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = a.getAttribute("href");
      img.alt = a.querySelector("img")?.alt || "";
      media.appendChild(img);
    }
    const label = a.dataset.caption || a.querySelector("img")?.alt || "";
    cap.textContent = group.length > 1 ? `${label}  ·  ${idx + 1} / ${group.length}` : label;
  };
  const open = (a) => {
    const wall = a.closest(".masonry");
    group = wall ? Array.from(wall.querySelectorAll("a.pin:not(.pin--placeholder):not(.is-hidden)")) : [a];
    box.classList.toggle("lightbox--single", group.length < 2);
    idx = group.indexOf(a);
    lastFocus = document.activeElement;
    box.classList.add("is-open");
    document.body.style.overflow = "hidden";
    render();
    box.querySelector(".lightbox__close").focus();
  };
  const close = () => {
    box.classList.remove("is-open");
    media.innerHTML = "";
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };
  const move = (d) => { idx = (idx + d + group.length) % group.length; render(); };

  links.forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); open(a); }));
  box.querySelector(".lightbox__close").addEventListener("click", close);
  box.querySelector(".lightbox__prev").addEventListener("click", () => move(-1));
  box.querySelector(".lightbox__next").addEventListener("click", () => move(1));
  box.addEventListener("click", (e) => { if (e.target === box) close(); });
  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
  });
})();

/* --------------------------------------------------------------------------
   Scroll-spy: highlight the nav link for the section in view
   -------------------------------------------------------------------------- */
(function scrollSpy() {
  const links = Array.from(document.querySelectorAll('.nav a[href^="#"]:not(.btn)'));
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if (!sections.length || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach((s) => io.observe(s));

  // close the mobile menu after tapping a link
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  nav?.addEventListener("click", (e) => {
    if (e.target.closest("a") && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    }
  });
})();

/* --------------------------------------------------------------------------
   Gallery filter chips
   -------------------------------------------------------------------------- */
(function galleryFilter() {
  const chips = Array.from(document.querySelectorAll(".filters .chip"));
  const pins = Array.from(document.querySelectorAll(".masonry .pin"));
  const wall = document.querySelector(".masonry");
  const more = document.querySelector("[data-show-all]");
  if (!chips.length || !pins.length) return;
  more?.addEventListener("click", () => wall.classList.remove("is-collapsed"));
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const cat = chip.dataset.filter;
      wall.classList.remove("is-collapsed");
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      pins.forEach((p) => p.classList.toggle("is-hidden", cat !== "all" && p.dataset.cat !== cat));
    });
  });
})();

/* --------------------------------------------------------------------------
   YouTube: load the iframe only when the viewer taps play
   -------------------------------------------------------------------------- */
(function youtube() {
  document.querySelectorAll(".yt[data-yt]").forEach((box) => {
    box.addEventListener("click", () => {
      const id = box.dataset.yt;
      const f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      f.title = "YouTube video";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      f.allowFullscreen = true;
      box.innerHTML = ""; box.appendChild(f);
    }, { once: true });
  });
})();
