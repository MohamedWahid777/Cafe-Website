/* ============================================================
   BREW & SOUL — main.js  v3.0
   Theme · Language · Nav · Sidebar Mobile Menu · Toast · Active Links
   ============================================================ */
(function () {
  "use strict";

  /* ─────────────────────────────────────────────
     THEME TOGGLE
  ───────────────────────────────────────────── */
  function applyTheme(theme) {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");

    document.querySelectorAll("[data-theme-icon]").forEach(function (el) {
      el.textContent = theme === "dark" ? "light_mode" : "dark_mode";
      el.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      );
      el.style.transition = "none";
      el.style.transform = "rotate(-45deg) scale(0.8)";
      el.style.opacity = "0";
      setTimeout(function () {
        el.style.transition = "all 0.45s cubic-bezier(0.34,1.56,0.64,1)";
        el.style.transform = "rotate(0deg) scale(1)";
        el.style.opacity = "1";
      }, 10);
    });
  }

  window.themeToggle = function () {
    const next =
      (localStorage.getItem("bs_theme") || "light") === "dark"
        ? "light"
        : "dark";
    localStorage.setItem("bs_theme", next);
    applyTheme(next);
  };

  /* ─────────────────────────────────────────────
     LANGUAGE TOGGLE
  ───────────────────────────────────────────── */
  function applyLanguage(lang) {
    const isAr = lang === "ar";
    document.documentElement.lang = isAr ? "ar" : "en";
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.documentElement.classList.toggle("lang-ar", isAr);

    document.querySelectorAll("[data-en]").forEach(function (el) {
      var text = isAr ? el.dataset.ar || el.dataset.en : el.dataset.en;
      if (text != null && !el.querySelector("[data-en]")) {
        el.textContent = text;
      }
    });

    document.querySelectorAll("[data-placeholder-en]").forEach(function (el) {
      el.placeholder = isAr
        ? el.dataset.placeholderAr || el.dataset.placeholderEn
        : el.dataset.placeholderEn;
    });

    const langBtn = document.getElementById("lang-toggle");
    if (langBtn) langBtn.textContent = isAr ? "EN" : "ع";

    localStorage.setItem("bs_lang", lang);
  }

  window.langToggle = function () {
    const next =
      (localStorage.getItem("bs_lang") || "ar") === "ar" ? "en" : "ar";
    localStorage.setItem("bs_lang", next);
    applyLanguage(next);
  };

  /* ─────────────────────────────────────────────
     NAV SCROLL
  ───────────────────────────────────────────── */
  function navScroll() {
    var nav = document.getElementById("main-nav");
    if (!nav) return;
    function onScroll() {
      nav.classList.toggle("scrolled", window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ─────────────────────────────────────────────
     ACTIVE NAV LINK
  ───────────────────────────────────────────── */
  function setActiveNav() {
    var path = window.location.pathname || "/";
    var isHome =
      path === "/" ||
      (path.endsWith("index.html") && !path.includes("/pages/"));
    var isMenu = path.includes("/menu/");
    var isStory = path.includes("/story/");
    var isReservation = path.includes("/reservation/");
    var isContact = path.includes("/contact/");

    document
      .querySelectorAll(".nav-links a, #mobile-menu a.mob-link")
      .forEach(function (link) {
        link.classList.remove("nav-active");
        var href = link.getAttribute("href") || "";
        var match =
          (isHome &&
            (href.includes("index.html") || href === "/" || href === "#") &&
            !href.includes("/pages/")) ||
          (isMenu && href.includes("menu")) ||
          (isStory && href.includes("story")) ||
          (isReservation && href.includes("reservation")) ||
          (isContact && href.includes("contact"));
        if (match) link.classList.add("nav-active");
      });
  }

  /* ─────────────────────────────────────────────
     MOBILE SIDEBAR MENU
  ───────────────────────────────────────────── */
  function initMobileMenu() {
    var openBtn = document.getElementById("hamburger");
    var closeBtn = document.getElementById("mobile-menu-close");
    var menu = document.getElementById("mobile-menu");
    var overlay = document.getElementById("mobile-overlay");
    if (!menu) return;

    function openMenu() {
      menu.classList.add("open");
      if (overlay) overlay.classList.add("visible");
      document.body.style.overflow = "hidden";
    }
    function closeMenu() {
      menu.classList.remove("open");
      if (overlay) overlay.classList.remove("visible");
      document.body.style.overflow = "";
    }

    if (openBtn) openBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);

    menu.querySelectorAll("a.mob-link").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ─────────────────────────────────────────────
     WIRE TOGGLE BUTTONS
  ───────────────────────────────────────────── */
  function initButtons() {
    var themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) themeBtn.addEventListener("click", window.themeToggle);

    var langBtn = document.getElementById("lang-toggle");
    if (langBtn) langBtn.addEventListener("click", window.langToggle);

    document.querySelectorAll("[data-toggle-theme]").forEach(function (btn) {
      btn.addEventListener("click", window.themeToggle);
    });
    document.querySelectorAll("[data-toggle-lang]").forEach(function (btn) {
      btn.addEventListener("click", window.langToggle);
    });
  }

  /* ─────────────────────────────────────────────
     FEATURED DRINKS → go to menu + auto-add
  ───────────────────────────────────────────── */
  function initFeaturedDrinks() {
    document.querySelectorAll(".featured-drink-card").forEach(function (card) {
      card.addEventListener("click", function () {
        var name = card.getAttribute("data-name");
        var nameAr = card.getAttribute("data-name-ar");
        var price = card.getAttribute("data-price");
        if (!name || !price) return;
        localStorage.setItem(
          "bs_auto_add",
          JSON.stringify({ name: name, nameAr: nameAr, price: price }),
        );
        var inPages = window.location.pathname.includes("/pages/");
        var dest = inPages ? "../menu/index.html" : "pages/menu/index.html";
        card.style.transform = "scale(0.97)";
        setTimeout(function () {
          window.location.href = dest;
        }, 150);
      });
    });
  }

  /* ─────────────────────────────────────────────
     TOAST
  ───────────────────────────────────────────── */
  window.showSuccessToast = function (message) {
    var t = document.createElement("div");
    t.style.cssText = [
      "position:fixed",
      "bottom:6rem",
      "left:50%",
      "transform:translateX(-50%)",
      "background:#2c1810",
      "color:#ede8e3",
      "padding:0.875rem 2rem",
      "border-radius:0.5rem",
      'font-family:"DM Mono",monospace',
      "font-size:13px",
      "z-index:9999",
      "white-space:nowrap",
      "box-shadow:0 4px 24px rgba(44,24,16,0.35)",
      "animation:fadeInUp 0.3s ease forwards",
    ].join(";");
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(function () {
      t.style.opacity = "0";
      t.style.transition = "opacity 0.35s ease";
    }, 3000);
    setTimeout(function () {
      t.remove();
    }, 3400);
  };

  /* ─────────────────────────────────────────────
     AOS
  ───────────────────────────────────────────── */
  function initAOS() {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 700,
        easing: "ease-out-cubic",
        once: true,
        offset: 60,
      });
    }
  }

  /* ─────────────────────────────────────────────
     APPLY SAVED PREFS BEFORE PAINT (no flash)
  ───────────────────────────────────────────── */
  (function () {
    if (localStorage.getItem("bs_theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  })();

  /* ─────────────────────────────────────────────
     DOM READY
  ───────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(localStorage.getItem("bs_theme") || "light");
    applyLanguage(localStorage.getItem("bs_lang") || "ar");
    initButtons();
    navScroll();
    initMobileMenu();
    setActiveNav();
    initFeaturedDrinks();
    initAOS();
  });
})();
