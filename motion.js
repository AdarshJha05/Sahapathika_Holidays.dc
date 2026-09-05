/**
 * motion.js — Sahapathika Holidays
 * Vanilla JS animation + hamburger engine. No frameworks.
 */
"use strict";

/* 1. SCROLL-TRIGGERED REVEAL */
function initScrollReveals() {
  if (!("IntersectionObserver" in window)) return;
  function tagElements() {
    document.querySelectorAll("section").forEach(function(el) {
      if (!el.classList.contains("sh-visible")) {
        el.classList.add("sh-section");
        var kids = el.querySelectorAll(":scope > div > div, :scope > div > article, :scope > div > li");
        kids.forEach(function(k, i) { k.style.setProperty("--si", i); k.classList.add("sh-child"); });
      }
    });
  }
  function observe() {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add("sh-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.07, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll(".sh-section").forEach(function(el) { io.observe(el); });
  }
  tagElements(); observe();
  var deb;
  var mo = new MutationObserver(function() { clearTimeout(deb); deb = setTimeout(function() { tagElements(); observe(); }, 350); });
  mo.observe(document.body, { childList: true, subtree: true });
}

/* 2. CARD HOVER CLASSES */
function initCardHovers() {
  function apply() {
    document.querySelectorAll(
      "div[style*=\"border-radius:22px\"][style*=\"overflow:hidden\"][style*=\"flex:0 0\"]," +
      "div[style*=\"border-radius:22px\"][style*=\"overflow:hidden\"][style*=\"background:#fff\"]"
    ).forEach(function(card) {
      if (card.classList.contains("sh-card")) return;
      card.classList.add("sh-card");
      var img = card.querySelector("image-slot,img");
      if (img) img.classList.add("sh-card-img");
      var badge = card.querySelector("[style*=\"border-radius:99px\"][style*=\"font-weight:800\"]");
      if (badge) badge.classList.add("sh-badge");
    });
    document.querySelectorAll("div[style*=\"border-radius:24px\"][style*=\"background:#fff\"]").forEach(function(c) {
      if (!c.classList.contains("sh-testi")) c.classList.add("sh-testi");
    });
  }
  apply();
  var mo = new MutationObserver(function() { setTimeout(apply, 200); });
  mo.observe(document.body, { childList: true, subtree: true });
}

/* 3. GRID STAGGER SCROLL-IN */
function initGridStagger() {
  if (!("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add("sh-grid-visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });
  function tag() {
    document.querySelectorAll(".sh-card:not(.sh-grid-tagged),.sh-testi:not(.sh-grid-tagged)").forEach(function(c, i) {
      c.classList.add("sh-grid-tagged");
      c.style.setProperty("--ci", i % 8);
      io.observe(c);
    });
  }
  tag();
  var mo = new MutationObserver(function() { setTimeout(tag, 250); });
  mo.observe(document.body, { childList: true, subtree: true });
}

/* 4. HERO SEARCH PARALLAX */
function initParallax() {
  var ticking = false;
  window.addEventListener("scroll", function() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      var y = window.scrollY || 0;
      var w = document.querySelector("[style*=\"background:#FAF6EF\"][style*=\"border-radius:26px\"],[style*=\"background:#FAF6EF\"][style*=\"border-radius:24px\"]");
      if (w && y < 800) { w.style.transform = "translateY(" + (-y * 0.07) + "px)"; w.style.willChange = "transform"; }
      ticking = false;
    });
  }, { passive: true });
}

/* 5. TRUST BADGE FLOAT */
function initBadgeFloat() {
  function apply() {
    document.querySelectorAll("div[style*=\"background:#D9A441\"]").forEach(function(b) {
      if (!b.classList.contains("sh-float")) b.classList.add("sh-float");
    });
  }
  apply();
  var mo = new MutationObserver(function() { setTimeout(apply, 300); });
  mo.observe(document.body, { childList: true, subtree: true });
}

/* 6. MARQUEE PAUSE ON HOVER */
function initMarqueePause() {
  function apply() {
    document.querySelectorAll("[style*=\"animation:marquee\"]:not(.sh-marquee)").forEach(function(el) {
      el.classList.add("sh-marquee");
      if (el.parentElement) el.parentElement.classList.add("sh-marquee-wrap");
    });
  }
  apply();
  var mo = new MutationObserver(function() { setTimeout(apply, 300); });
  mo.observe(document.body, { childList: true, subtree: true });
}

/* 7. MEGA-MENU SLIDE-IN */
function initMegaMenu() {
  function tag() {
    document.querySelectorAll("div[style*=\"position:absolute\"][style*=\"top:100%\"][style*=\"background:#FAF6EF\"]:not(.sh-dropdown)").forEach(function(el) {
      el.classList.add("sh-dropdown");
    });
  }
  tag();
  var mo = new MutationObserver(function() { setTimeout(tag, 50); });
  mo.observe(document.body, { childList: true, subtree: true });
}

/* 8. BUTTON MICRO FX */
function initButtonEffects() {
  function apply() {
    document.querySelectorAll("button[style*=\"background:#E5483D\"]:not(.sh-btn),a[style*=\"background:#E5483D\"]:not(.sh-btn)").forEach(function(b) { b.classList.add("sh-btn"); });
    document.querySelectorAll("button[style*=\"background:#16211D\"]:not(.sh-btn-dark)").forEach(function(b) { b.classList.add("sh-btn-dark"); });
  }
  apply();
  var mo = new MutationObserver(function() { setTimeout(apply, 300); });
  mo.observe(document.body, { childList: true, subtree: true });
}

/* 9. INPUT GLOW */
function initInputGlow() {
  document.addEventListener("focusin", function(e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") e.target.classList.add("sh-focused");
  });
  document.addEventListener("focusout", function(e) { e.target.classList.remove("sh-focused"); });
}

/* 10. ACCORDION TRANSITIONS */
function initAccordions() {
  var mo = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      if (m.type === "attributes" && m.target && m.target.style) {
        var mh = m.target.style.maxHeight;
        if (mh !== undefined && mh !== "") m.target.classList.add("sh-accordion");
      }
    });
  });
  mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["style"] });
}

/* ═══════════════════════════════════════════════════════════
   11. HAMBURGER MENU — injected outside x-dc, event-delegated
   ═══════════════════════════════════════════════════════════ */
function initHamburger() {
  /* ── Inject drawer into body (outside React) ── */
  if (!document.getElementById("sh-mobile-nav")) {
    var drawerHTML = '<nav id="sh-mobile-nav" aria-label="Mobile navigation" aria-hidden="true">' +
      '<div id="sh-mobile-backdrop"></div>' +
      '<div id="sh-mobile-panel">' +
        '<button id="sh-mobile-close" aria-label="Close menu">' +
          '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">' +
            '<line x1="3" y1="3" x2="17" y2="17"/><line x1="17" y1="3" x2="3" y2="17"/>' +
          '</svg>' +
        '</button>' +
        '<div class="sh-mob-logo">' +
          '<img src="Site-logo1.svg" alt="Sahapathika Holidays" style="height:38px;width:auto;"/>' +
        '</div>' +
        '<ul class="sh-mob-links">' +
          '<li><button class="sh-mob-link" data-page="home">Home</button></li>' +
          '<li>' +
            '<button class="sh-mob-link sh-mob-has-sub" data-sub="destinations">Destinations ' +
              '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="sh-mob-chevron"><path d="M2 4l4 4 4-4"/></svg>' +
            '</button>' +
            '<ul class="sh-mob-sub" id="sh-sub-destinations">' +
              '<li><button class="sh-mob-sub-link" data-page="packages">Kerala</button></li>' +
              '<li><button class="sh-mob-sub-link" data-page="packages">Goa</button></li>' +
              '<li><button class="sh-mob-sub-link" data-page="packages">Rajasthan</button></li>' +
              '<li><button class="sh-mob-sub-link" data-page="packages">Himachal Pradesh</button></li>' +
              '<li><button class="sh-mob-sub-link" data-page="packages">View All</button></li>' +
            '</ul>' +
          '</li>' +
          '<li>' +
            '<button class="sh-mob-link sh-mob-has-sub" data-sub="packages">Packages ' +
              '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="sh-mob-chevron"><path d="M2 4l4 4 4-4"/></svg>' +
            '</button>' +
            '<ul class="sh-mob-sub" id="sh-sub-packages">' +
              '<li><button class="sh-mob-sub-link" data-page="packages">All Packages</button></li>' +
              '<li><button class="sh-mob-sub-link" data-page="packages">Beach &amp; Backwaters</button></li>' +
              '<li><button class="sh-mob-sub-link" data-page="packages">Hill Stations</button></li>' +
              '<li><button class="sh-mob-sub-link" data-page="packages">Wildlife</button></li>' +
              '<li><button class="sh-mob-sub-link" data-page="packages">Cultural &amp; Heritage</button></li>' +
            '</ul>' +
          '</li>' +
          '<li><button class="sh-mob-link" data-page="about">About</button></li>' +
          '<li><button class="sh-mob-link" data-page="contact">Contact</button></li>' +
        '</ul>' +
        '<div class="sh-mob-cta">' +
          '<a href="tel:+919072769547" class="sh-mob-tel">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 4 5.1 1 1 0 0 1 5 4Z" stroke="#FF8B80" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
            '+91 90727 69547' +
          '</a>' +
          '<button class="sh-mob-plan" data-page="contact">Plan My Trip \u2192</button>' +
        '</div>' +
      '</div>' +
    '</nav>';
    var div = document.createElement("div");
    div.innerHTML = drawerHTML;
    document.body.appendChild(div.firstChild);
  }

  /* ── Open / Close helpers ── */
  function nav()  { return document.getElementById("sh-mobile-nav"); }
  function ham()  { return document.getElementById("sh-hamburger"); }

  function openMenu() {
    var n = nav(), h = ham(); if (!n) return;
    n.classList.add("sh-open");
    n.setAttribute("aria-hidden", "false");
    if (h) h.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    var n = nav(), h = ham(); if (!n) return;
    n.classList.remove("sh-open");
    n.setAttribute("aria-hidden", "true");
    if (h) h.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    document.querySelectorAll(".sh-mob-sub.sh-sub-open").forEach(function(s) { s.classList.remove("sh-sub-open"); });
    document.querySelectorAll(".sh-mob-has-sub.sh-sub-open").forEach(function(b) { b.classList.remove("sh-sub-open"); });
  }

  /* ── Navigate to page via React component buttons ── */
  function goPage(page) {
    closeMenu();
    var map = {
      "home":     "button[onClick*=\"goHome\"], button[onclick*=\"goHome\"]",
      "packages": "button[onClick*=\"goPackages\"], button[onclick*=\"goPackages\"]",
      "about":    "button[onClick*=\"goAbout\"], button[onclick*=\"goAbout\"]",
      "contact":  "button[onClick*=\"goContact\"], button[onclick*=\"goContact\"]"
    };
    var sel = map[page];
    if (sel) {
      setTimeout(function() {
        var btn = document.querySelector(sel);
        if (btn) btn.click();
      }, 120);
    }
  }

  /* ── EVENT DELEGATION on document — survives React re-renders ── */
  document.addEventListener("click", function(e) {
    var t = e.target;

    /* Hamburger button or its children */
    var hamBtn = t.closest ? t.closest("#sh-hamburger") : (t.id === "sh-hamburger" ? t : null);
    if (hamBtn) {
      var n = nav();
      n && n.classList.contains("sh-open") ? closeMenu() : openMenu();
      return;
    }

    /* Backdrop click */
    if (t.id === "sh-mobile-backdrop") { closeMenu(); return; }

    /* Close button */
    var closeBtn = t.closest ? t.closest("#sh-mobile-close") : null;
    if (closeBtn) { closeMenu(); return; }

    /* Sub-menu toggle */
    var subBtn = t.closest ? t.closest(".sh-mob-has-sub") : null;
    if (subBtn) {
      var subId = "sh-sub-" + subBtn.dataset.sub;
      var sub = document.getElementById(subId);
      if (!sub) return;
      var isOpen = sub.classList.contains("sh-sub-open");
      document.querySelectorAll(".sh-mob-sub.sh-sub-open").forEach(function(s) { s.classList.remove("sh-sub-open"); });
      document.querySelectorAll(".sh-mob-has-sub.sh-sub-open").forEach(function(b) { b.classList.remove("sh-sub-open"); });
      if (!isOpen) { sub.classList.add("sh-sub-open"); subBtn.classList.add("sh-sub-open"); }
      return;
    }

    /* Nav link */
    var navLink = t.closest ? t.closest(".sh-mob-link[data-page]") : null;
    if (navLink && navLink.dataset.page) { goPage(navLink.dataset.page); return; }

    /* Sub link */
    var subLink = t.closest ? t.closest(".sh-mob-sub-link[data-page]") : null;
    if (subLink && subLink.dataset.page) { goPage(subLink.dataset.page); return; }

    /* Plan my trip button */
    var planBtn = t.closest ? t.closest(".sh-mob-plan") : null;
    if (planBtn) { goPage(planBtn.dataset.page || "contact"); return; }
  });

  /* Escape key */
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") { var n = nav(); if (n && n.classList.contains("sh-open")) closeMenu(); }
  });

  /* Close on resize to desktop */
  window.addEventListener("resize", function() {
    if (window.innerWidth > 1224) closeMenu();
  });
}

/* ── BOOT ── */
function boot() {
  initScrollReveals();
  initCardHovers();
  initGridStagger();
  initParallax();
  initBadgeFloat();
  initMarqueePause();
  initMegaMenu();
  initButtonEffects();
  initInputGlow();
  initAccordions();
  initHamburger();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}


