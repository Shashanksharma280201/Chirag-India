/* ==========================================================================
   Chirag India — site script
   --------------------------------------------------------------------------
   EDIT THE `SITE` BLOCK BELOW to update contact details, impact numbers and
   the pledge-form endpoint. Every page reads from it, so you only change it
   in one place.
   ========================================================================== */

const SITE = {
  // Contact (placeholders — replace with real values)
  helpline: "+91 00000 00000",          // emergency helpline shown on Donate page + footer
  helplineTel: "+910000000000",         // same number, digits only, for tel: links
  whatsapp: "910000000000",             // WhatsApp number in international format, digits only
  email: "hello@chiragindia.co.in",     // contact email
  website: "www.chiragindia.co.in",     // as printed on the standee

  // Impact counters (placeholders — replace with real numbers)
  impact: {
    eyesPledged: 5000,
    familiesReached: 1200,
    corneasDonated: 320,
  },

  // Pledge form endpoint.
  // Option A (recommended, free): create a form at https://formspree.io, then paste
  //   the endpoint here, e.g. "https://formspree.io/f/abcdwxyz".
  // Option B: leave blank and the form will open WhatsApp with the details pre-filled.
  formEndpoint: "",
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
   Impact counters (count up from 0 when scrolled into view)
   -------------------------------------------------------------------------- */
(function counters() {
  const nums = document.querySelectorAll("[data-count]");
  if (!nums.length) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = new Intl.NumberFormat("en-IN");

  nums.forEach((el) => {
    const key = el.getAttribute("data-count");
    const target = SITE.impact[key] ?? (parseInt(el.textContent, 10) || 0);
    el.dataset.target = String(target);
    el.textContent = reduce ? fmt.format(target) : "0";
  });
  if (reduce) return;

  const run = (el) => {
    const target = Number(el.dataset.target);
    const dur = 1800;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt.format(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
  }, { threshold: 0.4 });
  nums.forEach((el) => io.observe(el));
})();

/* --------------------------------------------------------------------------
   Lightbox for .collage links (images + videos)
   -------------------------------------------------------------------------- */
(function lightbox() {
  const links = Array.from(document.querySelectorAll(".masonry a.pin:not(.pin--placeholder)"));
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
    cap.textContent = `${a.dataset.caption || a.querySelector("img")?.alt || ""}  ·  ${idx + 1} / ${group.length}`;
  };
  const open = (a) => {
    const wall = a.closest(".masonry");
    group = Array.from(wall.querySelectorAll("a.pin:not(.pin--placeholder):not(.is-hidden)"));
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
   Pledge / contact forms
   -------------------------------------------------------------------------- */
(function forms() {
  document.querySelectorAll("form[data-form]").forEach((form) => {
    const msg = form.querySelector(".form-msg");
    const kind = form.getAttribute("data-form"); // "pledge" | "contact"
    const show = (cls, text) => { if (!msg) return; msg.className = "form-msg " + cls; msg.textContent = text; };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const btn = form.querySelector('[type="submit"]');

      // Option A: Formspree (or any endpoint that accepts JSON POST)
      if (SITE.formEndpoint) {
        btn.disabled = true;
        show("is-info", "Sending…");
        try {
          const res = await fetch(SITE.formEndpoint, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: data,
          });
          if (res.ok) {
            form.reset();
            show("is-ok", kind === "pledge"
              ? "Thank you. Your pledge is registered. Now tell your family today — they are the ones who will say yes."
              : "Thanks — we'll get back to you soon.");
          } else {
            show("is-err", "Something went wrong. Please try again or WhatsApp us.");
          }
        } catch {
          show("is-err", "Network error. Please try again or WhatsApp us.");
        } finally {
          btn.disabled = false;
        }
        return;
      }

      // Option B: no endpoint configured → open WhatsApp with the details pre-filled
      const lines = [kind === "pledge" ? "New eye donation pledge — Chirag India" : "Message via chiragindia.co.in"];
      data.forEach((v, k) => { if (String(v).trim()) lines.push(`${k}: ${v}`); });
      const url = "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
      show("is-info", "We've opened WhatsApp with your details pre-filled. Press send to complete your pledge.");
    });
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
