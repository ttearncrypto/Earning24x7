/* ============================================================
   Obido UI — vanilla JS (no jQuery / no external plugins)
   Header state, typewriter, center slider, tabs, parallax,
   marquee duplication, cookies banner
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header scroll state ---------- */

  var header = document.querySelector(".site-header");
  if (header) {
    function onScrollHeader() {
      header.classList.toggle("is-scrolled", (window.pageYOffset || 0) > 12);
    }
    window.addEventListener("scroll", onScrollHeader, { passive: true });
    onScrollHeader();
  }

  /* ---------- Seamless marquee duplication ----------
     Tracks animate with translateX(-50%), so the content
     must exist exactly twice. JS clones the children once.  */

  ["ob-banner__track", "ob-strip__track"].forEach(function (cls) {
    document.querySelectorAll("." + cls).forEach(function (track) {
      var html = track.innerHTML;
      track.innerHTML = html + html;
    });
  });

  /* ---------- Hero typewriter ---------- */

  document.querySelectorAll("[data-typewriter]").forEach(function (el) {
    var words;
    try {
      words = JSON.parse(el.getAttribute("data-typewriter"));
    } catch (e) {
      return;
    }
    if (!Array.isArray(words) || !words.length) return;

    if (reduceMotion) {
      el.textContent = words[0];
      return;
    }

    var caret = document.createElement("span");
    caret.className = "ob-caret";
    caret.setAttribute("aria-hidden", "true");

    var textNode = document.createTextNode("");
    el.textContent = "";
    el.appendChild(textNode);
    el.appendChild(caret);
    el.setAttribute("aria-label", words.join(", "));

    var wordIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var word = words[wordIndex];
      if (!deleting) {
        charIndex++;
        textNode.nodeValue = word.slice(0, charIndex);
        if (charIndex >= word.length) {
          deleting = true;
          setTimeout(tick, 2200);
          return;
        }
        setTimeout(tick, 62 + Math.random() * 40);
      } else {
        charIndex--;
        textNode.nodeValue = word.slice(0, charIndex);
        if (charIndex <= 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(tick, 420);
          return;
        }
        setTimeout(tick, 32);
      }
    }

    setTimeout(tick, 600);
  });

  /* ---------- Center-mode slider ---------- */

  var slider = document.getElementById("ob-slider");
  if (slider) {
    var prevBtn = document.querySelector("[data-slide-prev]");
    var nextBtn = document.querySelector("[data-slide-next]");

    function slideStep() {
      var card = slider.querySelector(".ob-slide");
      if (!card) return slider.clientWidth * 0.8;
      var gap = parseFloat(getComputedStyle(slider).gap) || 24;
      return card.getBoundingClientRect().width + gap;
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        slider.scrollBy({ left: -slideStep(), behavior: reduceMotion ? "auto" : "smooth" });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        slider.scrollBy({ left: slideStep(), behavior: reduceMotion ? "auto" : "smooth" });
      });
    }

    /* Start on the middle card so both sides peek in */
    requestAnimationFrame(function () {
      var cards = slider.querySelectorAll(".ob-slide");
      if (cards.length > 1) {
        var mid = cards[Math.floor(cards.length / 2)];
        slider.scrollLeft = mid.offsetLeft - (slider.clientWidth - mid.offsetWidth) / 2;
      }
    });
  }

  /* ---------- Tabs ---------- */

  document.querySelectorAll("[data-tabs]").forEach(function (root) {
    var buttons = root.querySelectorAll("[data-tab]");
    var panels = root.querySelectorAll("[data-tab-panel]");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-tab");
        buttons.forEach(function (b) {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-selected", b === btn ? "true" : "false");
        });
        panels.forEach(function (panel) {
          panel.classList.toggle("active", panel.getAttribute("data-tab-panel") === id);
        });
      });
    });
  });

  /* ---------- Light parallax on gallery items ---------- */

  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  if (parallaxEls.length && !reduceMotion) {
    var ticking = false;

    function applyParallax() {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.12;
        var progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        el.style.transform = "translateY(" + (progress * speed * -120).toFixed(1) + "px)";
      });
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(applyParallax);
      }
    }, { passive: true });
    applyParallax();
  }

  /* ---------- Cookies banner ---------- */

  var cookies = document.querySelector(".ob-cookies");
  if (cookies) {
    var KEY = "e24x7-cookies";
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) {}

    if (!stored) {
      setTimeout(function () { cookies.classList.add("show"); }, 1200);
    }

    cookies.querySelectorAll("[data-cookies]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        try { localStorage.setItem(KEY, btn.getAttribute("data-cookies")); } catch (e) {}
        cookies.classList.remove("show");
      });
    });
  }

})();
