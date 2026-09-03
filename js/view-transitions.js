// Earning24x7 by TTEarnCrypto — Glassmorphism UI enhancements
// View Transitions, reveal-on-scroll, search, back-to-top, mobile nav, filters

(function () {
  "use strict";

  /* ============================================================
     Lucide icon initialization
     ============================================================ */

  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }
  initIcons();
  document.addEventListener("DOMContentLoaded", initIcons);

  /* ============================================================
     View Transitions API — animated navigation between pages
     ============================================================ */

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
    if (href.startsWith("#")) return;

    event.preventDefault();

    var transition = document.startViewTransition(function () {
      window.location.href = link.href;
    });

    if (transition && typeof transition.finished === "object") {
      transition.finished.catch(function () {
        window.location.href = link.href;
      });
    }
  });

  /* ============================================================
     Reveal-on-scroll for elements with .reveal
     ============================================================ */

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     Staggered reveal for grid items
     ============================================================ */

  var staggerEls = document.querySelectorAll(".reveal-stagger");
  if ("IntersectionObserver" in window && staggerEls.length > 0) {
    var staggerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, idx) {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = (entry.target.dataset.stagger || 0) * 80 + "ms";
          entry.target.classList.add("visible");
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -20px 0px" });
    staggerEls.forEach(function (el, i) {
      el.dataset.stagger = i % 8;
      staggerObserver.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var hl = document.querySelectorAll("pre code");
    for (var i = 0; i < hl.length; i++) {
      hl[i].classList.add("reveal");
    }
    if (window.hljs && typeof window.hljs.highlightAll === "function") {
      try { window.hljs.highlightAll(); } catch (e) {}
    }
    addCopyButtons();
    document.body.classList.add("page-ready");
  });

  /* ============================================================
     Mobile navigation drawer
     ============================================================ */

  var navToggle = document.getElementById("nav-toggle");
  var navDrawer = document.getElementById("nav-drawer");

  if (navToggle && navDrawer) {
    navToggle.addEventListener("click", function () {
      var open = navDrawer.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        var firstLink = navDrawer.querySelector("a");
        if (firstLink) firstLink.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (navDrawer.classList.contains("open") &&
          !navDrawer.contains(event.target) &&
          !navToggle.contains(event.target)) {
        navDrawer.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    navDrawer.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        navDrawer.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navDrawer.classList.contains("open")) {
        navDrawer.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ============================================================
     Reading progress bar
     ============================================================ */

  var progressBar = document.getElementById("reading-progress");
  if (progressBar) {
    function updateProgress() {
      var doc = document.documentElement;
      var scrollTop = window.pageYOffset || doc.scrollTop;
      var total = doc.scrollHeight - doc.clientHeight;
      var pct = total > 0 ? (scrollTop / total) * 100 : 0;
      progressBar.style.width = pct + "%";
    }
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  /* ============================================================
     Copy-to-clipboard for code blocks
     ============================================================ */

  function addCopyButtons() {
    document.querySelectorAll("pre code").forEach(function (code) {
      var pre = code.closest("pre");
      if (!pre || pre.querySelector(".copy-btn")) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.setAttribute("aria-label", "Copy code to clipboard");
      btn.innerHTML =
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
      pre.style.position = "relative";
      pre.appendChild(btn);
      btn.addEventListener("click", function () {
        var text = code.textContent || "";
        function done() {
          btn.classList.add("copied");
          var original = btn.innerHTML;
          btn.innerHTML = "Copied!";
          setTimeout(function () {
            btn.innerHTML = original;
            btn.classList.remove("copied");
          }, 1500);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
        } else {
          fallbackCopy(text);
          done();
        }
      });
    });

    function fallbackCopy(text) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
    }
  }

  /* ============================================================
     Back-to-top button
     ============================================================ */

  var backToTop = document.getElementById("back-to-top");

  if (backToTop) {
    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (y > 500) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ============================================================
     Client-side search modal
     ============================================================ */

  var searchBtn = document.getElementById("search-toggle");
  var searchModal = document.getElementById("search-modal");
  var searchInput = document.getElementById("search-input");
  var searchResults = document.getElementById("search-results");
  var searchClose = document.getElementById("search-close");

  var SEARCH_INDEX = null;
  var searchIndexScript = document.getElementById("search-index");
  if (searchIndexScript) {
    try {
      SEARCH_INDEX = JSON.parse(searchIndexScript.textContent || "[]");
    } catch (e) {
      SEARCH_INDEX = [];
    }
  }

  function openSearch() {
    if (!searchModal) return;
    searchModal.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(function () {
      if (searchInput) searchInput.focus();
    }, 60);
  }

  function closeSearch() {
    if (!searchModal) return;
    searchModal.classList.remove("open");
    document.body.style.overflow = "";
    if (searchInput) { searchInput.value = ""; }
    renderResults([], true);
  }

  function normalize(s) {
    return String(s || "").toLowerCase().replace(/[^a-z0-9\s]/gi, "");
  }

  function renderResults(results, emptyOnly) {
    if (!searchResults) return;
    if (!results.length) {
      var empty = searchResults.querySelector(".search-results__empty");
      if (emptyOnly && empty) return;
      empty = document.createElement("div");
      empty.className = "search-results__empty";
      empty.textContent = "No matching results.";
      searchResults.innerHTML = "";
      searchResults.appendChild(empty);
      return;
    }
    searchResults.innerHTML = "";
    results.forEach(function (item) {
      var a = document.createElement("a");
      a.className = "search-result";
      a.href = item.url;
      var t = document.createElement("div");
      t.className = "search-result__title";
      t.textContent = item.title;
      var d = document.createElement("div");
      d.className = "search-result__desc";
      d.textContent = item.description || "";
      var u = document.createElement("div");
      u.className = "search-result__url";
      u.textContent = item.url;
      a.appendChild(t);
      a.appendChild(d);
      a.appendChild(u);
      searchResults.appendChild(a);
    });
  }

  function doSearch(query) {
    if (!SEARCH_INDEX) return [];
    var q = normalize(query.trim());
    if (!q) return [];
    var terms = q.split(/\s+/);
    var scored = SEARCH_INDEX
      .map(function (item) {
        var hay = normalize(item.title + " " + (item.description || "") + " " + (item.url || ""));
        var score = 0;
        terms.forEach(function (term) {
          if (term && hay.indexOf(term) !== -1) score++;
        });
        return { item: item, score: score };
      })
      .filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; });
    return scored.map(function (r) { return r.item; }).slice(0, 12);
  }

  if (searchBtn && searchModal) {
    searchBtn.addEventListener("click", openSearch);

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        renderResults(doSearch(searchInput.value));
      });
      searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          var results = doSearch(searchInput.value);
          if (results.length) window.location.href = results[0].url;
        }
      });
    }

    if (searchClose) {
      searchClose.addEventListener("click", closeSearch);
    }

    searchModal.addEventListener("click", function (event) {
      if (event.target === searchModal) closeSearch();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && searchModal.classList.contains("open")) closeSearch();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (searchModal.classList.contains("open")) closeSearch();
        else openSearch();
      }
    });
  }

  /* ============================================================
     Homepage: category filter pills
     ============================================================ */

  var filterPills = document.querySelectorAll(".filter-pill");
  var articleBlocks = document.querySelectorAll(".article-block");

  if (filterPills.length > 0) {
    filterPills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        filterPills.forEach(function (p) { p.classList.remove("active"); });
        pill.classList.add("active");
        var cat = pill.dataset.filter;
        articleBlocks.forEach(function (block) {
          if (cat === "all" || block.dataset.category === cat) {
            block.hidden = false;
          } else {
            block.hidden = true;
          }
        });
        currentlyShown = LOAD_STEP;
        applyVisibility();
      });
    });
  }

  /* ============================================================
     Homepage: Load More
     ============================================================ */

  var loadMoreBtn = document.getElementById("load-more");
  var LOAD_STEP = 6;
  var currentlyShown = LOAD_STEP;

  function visibleBlocks() {
    var out = [];
    articleBlocks.forEach(function (b) {
      if (!b.hidden) out.push(b);
    });
    return out;
  }

  function applyVisibility() {
    var visible = visibleBlocks();
    visible.forEach(function (b, i) {
      b.style.display = i < currentlyShown ? "" : "none";
    });
    if (loadMoreBtn) {
      loadMoreBtn.hidden = visible.length <= currentlyShown;
    }
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      currentlyShown += LOAD_STEP;
      applyVisibility();
    });
    applyVisibility();
  }

  /* ============================================================
     Homepage: inline search within article grid
     ============================================================ */

  var homeSearch = document.getElementById("home-search-input");
  if (homeSearch) {
    homeSearch.addEventListener("input", function () {
      var q = normalize(homeSearch.value);
      articleBlocks.forEach(function (block) {
        var hay = normalize((block.dataset.title || "") + " " + (block.dataset.desc || ""));
        if (!q || hay.indexOf(q) !== -1) {
          block.hidden = false;
        } else {
          block.hidden = true;
        }
      });
      currentlyShown = LOAD_STEP;
      applyVisibility();
    });
  }

  /* ============================================================
     Highlight active nav link
     ============================================================ */

  function highlightNav() {
    var path = window.location.pathname.replace(/\/$/, "");
    var links = document.querySelectorAll(".site-nav__desktop a, .site-nav__drawer a");
    links.forEach(function (a) {
      var href = (a.getAttribute("href") || "").replace(/\/$/, "");
      if (!href) return;
      a.classList.remove("active");
      if (href === path) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", highlightNav);

})();
