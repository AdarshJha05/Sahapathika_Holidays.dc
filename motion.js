/**
 * motion.js — Sahapathika Holidays
 * Vanilla JS animation engine. No frameworks. No dependencies.
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
      if (m.type === "attributes" && m.target.style) {
        var mh = m.target.style.maxHeight;
        if (mh !== undefined) m.target.classList.add("sh-accordion");
      }
    });
  });
  mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["style"] });
}

/* BOOT */
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
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

/* ─── HAMBURGER MENU ─────────────────────────────────────────────────────── */
function initHamburger() {
  var ham     = document.getElementById("sh-hamburger");
  var nav     = document.getElementById("sh-mobile-nav");
  var close   = document.getElementById("sh-mobile-close");
  var back    = document.getElementById("sh-mobile-backdrop");
  if (!ham || !nav) return;

  function openMenu() {
    nav.classList.add("sh-open");
    ham.setAttribute("aria-expanded", "true");
    nav.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    nav.classList.remove("sh-open");
    ham.setAttribute("aria-expanded", "false");
    nav.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    // Close all open subs
    document.querySelectorAll(".sh-mob-sub.sh-sub-open").forEach(function(s) { s.classList.remove("sh-sub-open"); });
    document.querySelectorAll(".sh-mob-link.sh-sub-open").forEach(function(b) { b.classList.remove("sh-sub-open"); });
  }

  ham.addEventListener("click", function() {
    nav.classList.contains("sh-open") ? closeMenu() : openMenu();
  });
  if (close) close.addEventListener("click", closeMenu);
  if (back)  back.addEventListener("click", closeMenu);

  // Sub-menu toggles
  document.querySelectorAll(".sh-mob-has-sub").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var subId = "sh-sub-" + btn.dataset.sub;
      var sub   = document.getElementById(subId);
      if (!sub) return;
      var isOpen = sub.classList.contains("sh-sub-open");
      // Close all
      document.querySelectorAll(".sh-mob-sub.sh-sub-open").forEach(function(s) { s.classList.remove("sh-sub-open"); });
      document.querySelectorAll(".sh-mob-link.sh-sub-open").forEach(function(b) { b.classList.remove("sh-sub-open"); });
      if (!isOpen) { sub.classList.add("sh-sub-open"); btn.classList.add("sh-sub-open"); }
    });
  });

  // Nav link page navigation — hook into the React component's go() function
  function goPage(page, extra) {
    closeMenu();
    // The component exposes navigation via click events on its own buttons
    // Find matching button and click it
    var map = {
      "home":     "[onClick*=\"goHome\"]",
      "packages": "[onClick*=\"goPackages\"]",
      "about":    "[onClick*=\"goAbout\"]",
      "contact":  "[onClick*=\"goContact\"]"
    };
    var sel = map[page];
    if (sel) {
      var btn = document.querySelector(sel);
      if (btn) { setTimeout(function() { btn.click(); }, 80); }
    }
  }

  document.querySelectorAll(".sh-mob-link[data-page]").forEach(function(btn) {
    btn.addEventListener("click", function() { goPage(btn.dataset.page); });
  });
  document.querySelectorAll(".sh-mob-sub-link[data-page]").forEach(function(btn) {
    btn.addEventListener("click", function() { goPage(btn.dataset.page); });
  });
  document.querySelectorAll(".sh-mob-plan").forEach(function(btn) {
    btn.addEventListener("click", function() { goPage(btn.dataset.page || "contact"); });
  });

  // Close on Escape key
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && nav.classList.contains("sh-open")) closeMenu();
  });

  // Re-close menu on page resize back to desktop
  window.addEventListener("resize", function() {
    if (window.innerWidth > 900) closeMenu();
  });
}

// Append to boot
var _origBoot = boot;
if (typeof boot !== "undefined") {
  document.addEventListener("DOMContentLoaded", initHamburger);
}
if (document.readyState !== "loading") {
  initHamburger();
}
