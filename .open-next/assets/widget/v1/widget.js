/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
/**
 * EarnedStar Review Widget v1
 *
 * <script src="https://earnedstar.com/embed/v1/widget.js"
 *   data-key="YOUR_API_KEY"
 *   data-widget="carousel"
 *   data-theme="earnedstar-classic"
 *   data-max="6"
 *   data-api="https://earnedstar-back.vercel.app/api"></script>
 *
 * data-widget: carousel | grid | feed | testimonial | floating
 * data-theme: earnedstar-classic | dark-premium | automotive-orange | local-trust
 * data-max: max reviews to show (default 6)
 * data-target: CSS selector to mount into (default: script parent)
 *
 * Theme tokens SSOT: brand/earnedstar/WIDGET_THEMES.json (workspace)
 */
(function () {
  "use strict";

  var SCRIPT = document.currentScript;
  if (!SCRIPT) return;

  var API_BASE =
    SCRIPT.getAttribute("data-api") || "https://earnedstar-back.vercel.app/api";
  var config = {
    key: SCRIPT.getAttribute("data-key") || "demo",
    widget: SCRIPT.getAttribute("data-widget") || "carousel",
    theme: SCRIPT.getAttribute("data-theme") || "earnedstar-classic",
    max: parseInt(SCRIPT.getAttribute("data-max") || "6", 10),
    target: SCRIPT.getAttribute("data-target") || "",
  };

  /** Mirrors brand/earnedstar/WIDGET_THEMES.json — keep in sync */
  var THEME_PRESETS = {
    "earnedstar-classic": {
      starFill: "#F59E0B",
      starEmpty: "#E5E7EB",
      brandText: "#0F2044",
      verifiedGreen: "#059669",
      verifiedBg: "#D1FAE5",
      cardBg: "#FFFFFF",
      cardBorder: "#E5E7EB",
      mutedText: "#64748B",
      fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
    },
    "dark-premium": {
      starFill: "#F59E0B",
      starEmpty: "#374151",
      brandText: "#F9FAFB",
      verifiedGreen: "#34D399",
      verifiedBg: "#064E3B",
      cardBg: "#1F2937",
      cardBorder: "#374151",
      mutedText: "#9CA3AF",
      fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
    },
    "automotive-orange": {
      starFill: "#F59E0B",
      starEmpty: "#4B5563",
      brandText: "#FDF8EE",
      verifiedGreen: "#059669",
      verifiedBg: "#064E3B",
      cardBg: "#0D1217",
      cardBorder: "#374151",
      mutedText: "#9CA3AF",
      fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
    },
    "local-trust": {
      starFill: "#F59E0B",
      starEmpty: "#D1D5DB",
      brandText: "#111827",
      verifiedGreen: "#059669",
      verifiedBg: "#D1FAE5",
      cardBg: "#FDF8EE",
      cardBorder: "#E5E7EB",
      mutedText: "#6B7280",
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

  function stars(rating) {
    var wrap = el("span", { color: T.starFill, letterSpacing: "1px", fontSize: "14px" });
    var full = Math.round(rating);
    wrap.textContent = "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
    return wrap;
  }

  function card(review) {
    var box = el("div", {
      border: "1px solid " + T.cardBorder,
      borderRadius: "12px",
      padding: "16px",
      background: T.cardBg,
      minWidth: config.widget === "carousel" ? "260px" : "auto",
      flex: config.widget === "carousel" ? "0 0 260px" : "1 1 auto",
    });
    var head = el("div", { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" });
    head.appendChild(el("strong", { color: T.brandText, fontSize: "14px" }, review.customer_name));
    if (review.verified_purchase !== false) {
      head.appendChild(
        el("span", {
          background: T.verifiedBg,
          color: T.verifiedGreen,
          fontSize: "10px",
          fontWeight: "600",
          padding: "2px 6px",
          borderRadius: "999px",
        }, "✓ Verified"),
      );
    }
    box.appendChild(head);
    box.appendChild(stars(review.rating_overall));
    var text = (review.review_text || "").slice(0, 220);
    if ((review.review_text || "").length > 220) text += "…";
    box.appendChild(el("p", { margin: "10px 0 0", fontSize: "13px", color: T.mutedText, lineHeight: "1.5" }, text));
    return box;
  }

  function header(merchant) {
    var wrap = el("div", { marginBottom: "16px" });
    wrap.appendChild(
      el("div", { fontSize: "18px", fontWeight: "700", color: T.brandText }, merchant.name + " Reviews"),
    );
    var meta = el("div", { marginTop: "6px", fontSize: "13px", color: T.mutedText });
    meta.appendChild(stars(merchant.avg_rating));
    meta.appendChild(
      document.createTextNode(
        " " + merchant.avg_rating.toFixed(1) + " · " + merchant.review_count.toLocaleString() + " verified reviews",
      ),
    );
    wrap.appendChild(meta);
    return wrap;
  }

  function injectSchema(merchant) {
    if (document.querySelector("script[data-earnedstar-schema]")) return;
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-earnedstar-schema", "1");
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: merchant.name,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: merchant.avg_rating,
        reviewCount: merchant.review_count,
        bestRating: 5,
        worstRating: 1,
      },
    });
    document.head.appendChild(script);
  }

  function renderFloating(payload) {
    var review = (payload.reviews || [])[0];
    if (!review) return render(payload);
    var bubble = el("div", {
      position: "fixed",
      right: "20px",
      bottom: "20px",
      zIndex: "9999",
      maxWidth: "280px",
      background: T.cardBg,
      border: "1px solid " + T.cardBorder,
      borderRadius: "16px",
      padding: "14px",
      boxShadow: "0 12px 40px rgba(15,32,68,0.18)",
      fontFamily: T.fontFamily,
    });
    bubble.appendChild(el("div", { fontSize: "12px", fontWeight: "700", color: T.brandText, marginBottom: "6px" }, payload.merchant.name));
    bubble.appendChild(stars(review.rating_overall));
    bubble.appendChild(el("p", { margin: "8px 0 0", fontSize: "12px", color: T.mutedText, lineHeight: "1.4" }, (review.review_text || "").slice(0, 120)));
    document.body.appendChild(bubble);
  }

  function render(payload) {
    injectSchema(payload.merchant);
    if (config.widget === "floating") {
      renderFloating(payload);
      return;
    }

    var mount =
      (config.target && document.querySelector(config.target)) ||
      SCRIPT.parentNode ||
      document.body;
    var root = el("div", {
      fontFamily: T.fontFamily,
      color: T.brandText,
      maxWidth: "100%",
    });
    root.setAttribute("class", "earnedstar-widget earnedstar-widget--" + config.widget);
    root.setAttribute("data-earnedstar-theme", config.theme);
    root.style.setProperty("--es-star-fill", T.starFill);
    root.style.setProperty("--es-brand-text", T.brandText);
    root.style.setProperty("--es-card-bg", T.cardBg);
    root.style.setProperty("--es-card-border", T.cardBorder);
    root.style.setProperty("--es-verified-green", T.verifiedGreen);
    root.appendChild(header(payload.merchant));

    var reviews = (payload.reviews || []).slice(0, config.max);
    if (!reviews.length) {
      root.appendChild(el("p", { fontSize: "14px", color: T.mutedText }, "No published reviews yet."));
      mount.appendChild(root);
      return;
    }

    if (config.widget === "testimonial") {
      root.appendChild(card(reviews[0]));
    } else if (config.widget === "feed") {
      reviews.forEach(function (r) {
        root.appendChild(card(r));
        root.lastChild.style.marginBottom = "12px";
      });
    } else if (config.widget === "grid") {
      var grid = el("div", {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "12px",
      });
      reviews.forEach(function (r) {
        grid.appendChild(card(r));
      });
      root.appendChild(grid);
    } else {
      var track = el("div", {
        display: "flex",
        gap: "12px",
        overflowX: "auto",
        paddingBottom: "8px",
        scrollSnapType: "x mandatory",
      });
      reviews.forEach(function (r) {
        var c = card(r);
        c.style.scrollSnapAlign = "start";
        track.appendChild(c);
      });
      root.appendChild(track);
    }

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
    fetch(API_BASE + "/earnedstar/reviews/embed/" + encodeURIComponent(config.key))
      .then(function (res) {
        if (!res.ok) throw new Error("EarnedStar widget failed to load");
        return res.json();
      })
      .then(render)
      .catch(function () {
        var mount = SCRIPT.parentNode || document.body;
        mount.appendChild(
          el("div", { fontSize: "12px", color: T.mutedText, padding: "8px" }, "EarnedStar reviews unavailable"),
        );
      });
  }

  if ("IntersectionObserver" in window && config.widget !== "floating") {
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
