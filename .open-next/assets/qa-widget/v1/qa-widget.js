/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
/**
 * EarnedStar Q&A Widget v1 (Bible Phase 4h)
 *
 * <script src="https://earnedstar.com/qa-widget/v1/qa-widget.js"
 *   data-key="YOUR_API_KEY"
 *   data-theme="earnedstar-classic"
 *   data-max="10"
 *   data-api="https://earnedstar-back.vercel.app/api"></script>
 *
 * Shows previously-answered questions for the merchant and lets a shopper
 * submit a new question (moderated — it lands in the merchant's Q&A
 * dashboard queue and only appears here once answered + published). Pro/
 * Agency plans only — see EarnedstarService.getQaEmbedByApiKey /
 * PlanLimitsService.assertCanAccessQa; on a lower plan the feed fetch 403s
 * and this widget renders nothing rather than an error.
 *
 * data-theme: earnedstar-classic | dark-premium | automotive-orange | local-trust
 * data-max: max published Q&A items to show (default 10)
 * data-target: CSS selector to mount into (default: script parent)
 *
 * Mirrors public/widget/v1/widget.js's structure/theme tokens (SSOT:
 * brand/earnedstar/WIDGET_THEMES.json) so the two widgets look related when
 * dropped on the same page.
 */
(function () {
  "use strict";

  var SCRIPT = document.currentScript;
  if (!SCRIPT) return;

  var API_BASE =
    SCRIPT.getAttribute("data-api") || "https://earnedstar-back.vercel.app/api";
  var config = {
    key: SCRIPT.getAttribute("data-key") || "demo",
    theme: SCRIPT.getAttribute("data-theme") || "earnedstar-classic",
    max: parseInt(SCRIPT.getAttribute("data-max") || "10", 10),
    target: SCRIPT.getAttribute("data-target") || "",
  };

  /** Mirrors brand/earnedstar/WIDGET_THEMES.json — keep in sync with widget.js */
  var THEME_PRESETS = {
    "earnedstar-classic": {
      brandText: "#0F2044",
      cardBg: "#FFFFFF",
      cardBorder: "#E5E7EB",
      mutedText: "#64748B",
      accent: "#F59E0B",
      inputBg: "#FFFFFF",
      fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
    },
    "dark-premium": {
      brandText: "#F9FAFB",
      cardBg: "#1F2937",
      cardBorder: "#374151",
      mutedText: "#9CA3AF",
      accent: "#F59E0B",
      inputBg: "#111827",
      fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
    },
    "automotive-orange": {
      brandText: "#FDF8EE",
      cardBg: "#0D1217",
      cardBorder: "#374151",
      mutedText: "#9CA3AF",
      accent: "#F59E0B",
      inputBg: "#0D1217",
      fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
    },
    "local-trust": {
      brandText: "#111827",
      cardBg: "#FDF8EE",
      cardBorder: "#E5E7EB",
      mutedText: "#6B7280",
      accent: "#F59E0B",
      inputBg: "#FFFFFF",
      fontFamily: "Plus Jakarta Sans, Georgia, serif",
    },
  };

  var T = THEME_PRESETS[config.theme] || THEME_PRESETS["earnedstar-classic"];

  function el(tag, styles, text) {
    var node = document.createElement(tag);
    if (styles) {
      Object.keys(styles).forEach(function (k) {
        node.style[k] = styles[k];
      });
    }
    if (text != null) node.textContent = text;
    return node;
  }

  function qaItem(item) {
    var box = el("div", {
      border: "1px solid " + T.cardBorder,
      borderRadius: "12px",
      padding: "14px 16px",
      background: T.cardBg,
      marginBottom: "10px",
    });
    box.appendChild(el("p", { margin: "0", fontSize: "14px", fontWeight: "700", color: T.brandText }, "Q: " + item.question));
    box.appendChild(el("p", { margin: "6px 0 0", fontSize: "13px", color: T.mutedText, lineHeight: "1.5" }, "A: " + item.answer));
    return box;
  }

  function renderAskForm(root, merchantSlug) {
    var wrap = el("div", {
      marginTop: "16px",
      paddingTop: "16px",
      borderTop: "1px solid " + T.cardBorder,
    });
    wrap.appendChild(el("p", { margin: "0 0 8px", fontSize: "13px", fontWeight: "700", color: T.brandText }, "Ask a question"));

    var status = el("p", { margin: "8px 0 0", fontSize: "12px", color: T.mutedText, display: "none" });

    var textarea = document.createElement("textarea");
    textarea.placeholder = "What would you like to know?";
    textarea.rows = 2;
    textarea.maxLength = 500;
    Object.assign(textarea.style, {
      width: "100%",
      boxSizing: "border-box",
      border: "1px solid " + T.cardBorder,
      borderRadius: "8px",
      padding: "8px",
      fontSize: "13px",
      fontFamily: T.fontFamily,
      background: T.inputBg,
      color: T.brandText,
      resize: "vertical",
    });

    var button = el("button", {
      marginTop: "8px",
      background: T.accent,
      color: "#111827",
      border: "none",
      borderRadius: "8px",
      padding: "8px 14px",
      fontSize: "13px",
      fontWeight: "700",
      cursor: "pointer",
    }, "Submit question");

    button.addEventListener("click", function () {
      var question = textarea.value.trim();
      if (question.length < 5) {
        status.textContent = "Please enter at least 5 characters.";
        status.style.display = "block";
        return;
      }
      button.disabled = true;
      button.textContent = "Submitting…";
      fetch(API_BASE + "/earnedstar/qa/public/" + encodeURIComponent(merchantSlug) + "/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question }),
      })
        .then(function (res) {
          if (res.status === 429) {
            return res.json().then(function (body) {
              throw new Error(body.message || "Too many questions submitted — please try again later.");
            });
          }
          if (!res.ok) throw new Error("Unable to submit your question right now.");
          return res.json();
        })
        .then(function () {
          status.textContent = "Thanks! Your question was submitted and will appear here once answered.";
          status.style.color = T.mutedText;
          status.style.display = "block";
          textarea.value = "";
          button.textContent = "Submit question";
          button.disabled = false;
        })
        .catch(function (err) {
          status.textContent = err.message || "Something went wrong.";
          status.style.display = "block";
          button.textContent = "Submit question";
          button.disabled = false;
        });
    });

    wrap.appendChild(textarea);
    wrap.appendChild(button);
    wrap.appendChild(status);
    root.appendChild(wrap);
  }

  function render(payload) {
    var mount =
      (config.target && document.querySelector(config.target)) ||
      SCRIPT.parentNode ||
      document.body;
    var root = el("div", {
      fontFamily: T.fontFamily,
      color: T.brandText,
      maxWidth: "100%",
    });
    root.setAttribute("class", "earnedstar-qa-widget");
    root.setAttribute("data-earnedstar-theme", config.theme);

    root.appendChild(el("div", { fontSize: "16px", fontWeight: "700", color: T.brandText, marginBottom: "10px" }, "Questions & Answers"));

    var items = (payload.qa || []).slice(0, config.max);
    if (items.length === 0) {
      root.appendChild(el("p", { fontSize: "13px", color: T.mutedText }, "No questions answered yet — be the first to ask."));
    } else {
      items.forEach(function (item) {
        root.appendChild(qaItem(item));
      });
    }

    renderAskForm(root, payload.merchant.slug);

    var powered = el("a", {
      display: "block",
      marginTop: "12px",
      fontSize: "11px",
      color: T.mutedText,
      textDecoration: "none",
    });
    powered.href = "https://earnedstar.com";
    powered.textContent = "Powered by EarnedStar";
    root.appendChild(powered);

    mount.appendChild(root);
  }

  function loadWidget() {
    fetch(API_BASE + "/earnedstar/qa/embed/" + encodeURIComponent(config.key))
      .then(function (res) {
        // Not entitled (plan below Pro) or bad key — fail silently, no
        // broken-looking widget on the merchant's site.
        if (!res.ok) return null;
        return res.json();
      })
      .then(function (payload) {
        if (payload) render(payload);
      })
      .catch(function () {
        /* silent — see comment above */
      });
  }

  if ("IntersectionObserver" in window) {
    var placeholder = el("div", { minHeight: "1px" });
    SCRIPT.parentNode && SCRIPT.parentNode.insertBefore(placeholder, SCRIPT.nextSibling);
    var observer = new IntersectionObserver(
      function (entries) {
        if (entries[0] && entries[0].isIntersecting) {
          observer.disconnect();
          loadWidget();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(placeholder);
  } else {
    loadWidget();
  }
})();
