// View Transitions API - animated navigation between pages
// Uses native MPA view transitions where supported, with a progressive enhancement fallback.

(function () {
  "use strict";

  var supportsViewTransitions =
    document.startViewTransition &&
    CSS.supports("(view-transition-name: root)");

  document.addEventListener("click", function (event) {
    if (!supportsViewTransitions) return;

    var link = event.target.closest("a");
    if (!link) return;

    var href = link.getAttribute("href");
    if (!href) return;

    if (href.startsWith("http") && !href.startsWith(window.location.origin)) return;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) return;
    if (link.target && link.target !== "_self") return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.getAttribute("rel") === "nofollow") return;

    event.preventDefault();

    var transition = document.startViewTransition(function () {
      window.location.href = link.href;
    });

    // Fallback if the transition promise rejects (some browsers)
    if (transition && typeof transition.finished === "object") {
      transition.finished.catch(function () {
        window.location.href = link.href;
      });
    }
  });

  // Reveal-on-scroll for elements with .reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var hl = document.querySelectorAll("pre code");
    for (var i = 0; i < hl.length; i++) {
      hl[i].classList.add("reveal");
    }
  });
})();