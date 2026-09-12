// Earning24x7 by TTEarnCrypto — post article tools
// Font scaling, listen (text-to-speech), print, copy link, AI summarize menu,
// keyboard shortcuts help. Loaded only on post pages.

(function () {
  "use strict";

  var content = document.querySelector(".post-layout__main .post-content");
  if (!content) return;

  var toolData = document.getElementById("tool-data");
  var pageUrl = null;
  if (toolData) {
    try {
      pageUrl = JSON.parse(toolData.textContent || "{}").url || null;
    } catch (e) {}
  }

  /* ============================================================
     Font size — scales text via --post-scale on .post-content
     ============================================================ */

  var FONT_KEY = "ed24x7-post-scale";
  var SIZES = [90, 100, 110, 120, 130];

  function fontIndex() {
    var v = parseInt(localStorage.getItem(FONT_KEY), 10);
    return SIZES.indexOf(v) === -1 ? 1 : SIZES.indexOf(v);
  }

  function applyFont(idx, persist) {
    var s = SIZES[idx];
    content.style.setProperty("--post-scale", s + "%");
    var val = document.getElementById("tool-font-val");
    if (val) val.textContent = s + "%";
    if (persist) {
      try { localStorage.setItem(FONT_KEY, String(s)); } catch (e) {}
    }
  }

  var fontDec = document.getElementById("tool-font-dec");
  var fontInc = document.getElementById("tool-font-inc");
  if (fontDec) fontDec.addEventListener("click", function () { applyFont(Math.max(0, fontIndex() - 1), true); });
  if (fontInc) fontInc.addEventListener("click", function () { applyFont(Math.min(SIZES.length - 1, fontIndex() + 1), true); });
  applyFont(fontIndex(), false);

  /* ============================================================
     Listen — Web Speech API text-to-speech
     ============================================================ */

  var listenBtn = document.getElementById("tool-listen");
  var speaking = false;

  function contentText() {
    var nodes = content.querySelectorAll("h2, h3, h4, p, li, blockquote");
    var parts = [];
    nodes.forEach(function (n) {
      var t = (n.textContent || "").replace(/\s+/g, " ").trim();
      if (t) parts.push(t);
    });
    return parts.join(". ");
  }

  function setListen(state) {
    speaking = state;
    if (!listenBtn) return;
    var label = listenBtn.querySelector(".tool-btn__label");
    if (label) label.textContent = state ? "Stop" : "Listen";
    listenBtn.classList.toggle("active", state);
    listenBtn.setAttribute("aria-pressed", state ? "true" : "false");
  }

  function listenSupported() {
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }

  if (listenBtn && listenSupported()) {
    listenBtn.addEventListener("click", function () {
      if (speaking) {
        window.speechSynthesis.cancel();
        setListen(false);
        return;
      }
      var text = contentText();
      if (!text) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 1;
      u.pitch = 1;
      u.onend = function () { setListen(false); };
      u.onerror = function () { setListen(false); };
      setListen(true);
      window.speechSynthesis.speak(u);
    });
  } else if (listenBtn) {
    listenBtn.disabled = true;
    listenBtn.title = "Text-to-speech is not supported in this browser.";
  }

  window.addEventListener("pagehide", function () {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  });

  /* ============================================================
     Print
     ============================================================ */

  var printBtn = document.getElementById("tool-print");
  if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

  /* ============================================================
     Copy link
     ============================================================ */

  var copyBtn = document.getElementById("tool-copy-link");
  if (copyBtn && pageUrl) {
    copyBtn.addEventListener("click", function () {
      var label = copyBtn.querySelector(".tool-btn__label");
      var original = label ? label.textContent : "";
      function done() {
        copyBtn.classList.add("active");
        if (label) label.textContent = "Copied!";
        setTimeout(function () {
          copyBtn.classList.remove("active");
          if (label) label.textContent = original;
        }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(pageUrl).then(done, function () { fallbackCopy(pageUrl); done(); });
      } else {
        fallbackCopy(pageUrl);
        done();
      }
    });
  }

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

  /* ============================================================
     Summarize dropdown (ChatGPT, Gemini, Perplexity, Claude, Copilot)
     ============================================================ */

  var sumBtn = document.getElementById("tool-summarize");
  var sumMenu = document.getElementById("tool-summarize-menu");
  if (sumBtn && sumMenu) {
    function setSumOpen(open) {
      sumMenu.classList.toggle("open", open);
      sumBtn.setAttribute("aria-expanded", open ? "true" : "false");
    }
    sumBtn.addEventListener("click", function () {
      setSumOpen(!sumMenu.classList.contains("open"));
    });
    document.addEventListener("click", function (e) {
      if (sumMenu.classList.contains("open") && !sumMenu.contains(e.target) && !sumBtn.contains(e.target)) {
        setSumOpen(false);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sumMenu.classList.contains("open")) setSumOpen(false);
    });
  }

  /* ============================================================
     Keyboard shortcuts + help modal
     ============================================================ */

  var SHORTCUTS = [
    { keys: "?", desc: "Show keyboard shortcuts" },
    { keys: "/", desc: "Open site search" },
    { keys: "L", desc: "Play / stop reading the article" },
    { keys: "P", desc: "Print this article" },
    { keys: "T", desc: "Back to top" },
    { keys: "[", desc: "Previous article" },
    { keys: "]", desc: "Next article" }
  ];

  var shortcutsModal = null;

  function buildShortcutsModal() {
    var overlay = document.createElement("div");
    overlay.className = "shortcuts-modal";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Keyboard shortcuts");

    var panel = document.createElement("div");
    panel.className = "shortcuts-modal__panel";

    var title = document.createElement("h2");
    title.className = "shortcuts-modal__title";
    title.textContent = "Keyboard shortcuts";

    var list = document.createElement("ul");
    list.className = "shortcuts-modal__list";
    SHORTCUTS.forEach(function (s) {
      var li = document.createElement("li");
      var k = document.createElement("kbd");
      k.textContent = s.keys;
      var d = document.createElement("span");
      d.textContent = s.desc;
      li.appendChild(k);
      li.appendChild(d);
      list.appendChild(li);
    });

    var close = document.createElement("button");
    close.type = "button";
    close.className = "tool-btn shortcuts-modal__close";
    close.textContent = "Close (Esc)";

    panel.appendChild(title);
    panel.appendChild(list);
    panel.appendChild(close);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    function open() { overlay.classList.add("open"); }
    function closeModal() { overlay.classList.remove("open"); }

    close.addEventListener("click", closeModal);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });

    return { open: open, el: overlay };
  }

  var shortcutsBtn = document.getElementById("tool-shortcuts");
  if (shortcutsBtn) {
    shortcutsModal = buildShortcutsModal();
    shortcutsBtn.addEventListener("click", function () { shortcutsModal.open(); });
  }

  function isTyping(e) {
    var t = e.target;
    if (!t) return false;
    var tag = t.tagName || "";
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t.isContentEditable;
  }

  function gotoLink(selector) {
    var a = document.querySelector(selector);
    if (a && a.href) window.location.href = a.href;
  }

  document.addEventListener("keydown", function (e) {
    if (isTyping(e)) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;

    var key = e.key;
    if (shortcutsModal && key === "?") {
      e.preventDefault();
      shortcutsModal.open();
      return;
    }
    switch (String(key || "").toLowerCase()) {
      case "/":
        e.preventDefault();
        var sb = document.getElementById("search-toggle");
        if (sb) sb.click();
        break;
      case "l":
        if (listenBtn && !listenBtn.disabled) {
          e.preventDefault();
          listenBtn.click();
        }
        break;
      case "p":
        e.preventDefault();
        window.print();
        break;
      case "t":
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "[":
        e.preventDefault();
        gotoLink(".post_navi .nav_prev");
        break;
      case "]":
        e.preventDefault();
        gotoLink(".post_navi .nav_next");
        break;
    }
  });
})();