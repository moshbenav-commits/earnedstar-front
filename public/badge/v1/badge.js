/**
 * EarnedStar Badge Widget v1
 * <script src="https://badge.earnedstar.io/v1/badge.js" data-key="..." data-style="origami" data-size="68" data-position="top-right"></script>
 */
(function () {
  "use strict";

  var SCRIPT = document.currentScript;
  if (!SCRIPT) return;

  var config = {
    key: SCRIPT.getAttribute("data-key") || "demo",
    style: SCRIPT.getAttribute("data-style") || "origami",
    size: parseInt(SCRIPT.getAttribute("data-size") || "68", 10),
    position: SCRIPT.getAttribute("data-position") || "bottom-right",
    target: SCRIPT.getAttribute("data-target") || "",
    rating: SCRIPT.getAttribute("data-rating") || "4.9",
    count: SCRIPT.getAttribute("data-count") || "2,847",
  };

  var POSITIONS = {
    "top-right": { top: "20px", right: "20px", bottom: "auto", left: "auto" },
    "top-left": { top: "20px", left: "20px", bottom: "auto", right: "auto" },
    "bottom-right": { bottom: "20px", right: "20px", top: "auto", left: "auto" },
    "bottom-left": { bottom: "20px", left: "20px", top: "auto", right: "auto" },
  };

  var STAR_PATH =
    "M50,6 L61,35 L91,35 L68,54 L77,82 L50,65 L23,82 L32,54 L9,35 L39,35 Z";

  function buildSvg(size) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="' +
      size +
      '" height="' +
      size +
      '" role="img" aria-label="EarnedStar verified badge">' +
      "<defs><radialGradient id=\"esg\" cx=\"38%\" cy=\"32%\" r=\"68%\">" +
      '<stop offset="0%" stop-color="#FBBF24"/>' +
      '<stop offset="55%" stop-color="#F59E0B"/>' +
      '<stop offset="100%" stop-color="#92400E"/>' +
      "</radialGradient></defs>" +
      '<path d="' +
      STAR_PATH +
      '" fill="url(#esg)"/>' +
      '<path d="M50,6 L61,35 L50,65 Z" fill="rgba(255,255,255,0.12)"/>' +
      '<path d="M50,6 L39,35 L50,65 Z" fill="rgba(0,0,0,0.08)"/>' +
      '<circle cx="50" cy="50" r="17" fill="white" opacity="0.97"/>' +
      '<circle cx="50" cy="50" r="17" fill="none" stroke="#F59E0B" stroke-width="1.8"/>' +
      '<text x="50" y="54" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="800" fill="#F59E0B">ES</text>' +
      "</svg>"
    );
  }

  function mount(opts) {
    opts = opts || {};
    var cfg = Object.assign({}, config, opts);
    var pos = POSITIONS[cfg.position] || POSITIONS["bottom-right"];
    var size = cfg.size || 68;

    var host = document.createElement("div");
    host.setAttribute("data-earnedstar-badge", cfg.key);

    var shadow = host.attachShadow({ mode: "open" });
    var style = document.createElement("style");
    style.textContent =
      ":host{all:initial;font-family:system-ui,sans-serif}" +
      ".wrap{position:fixed;z-index:2147483000;cursor:pointer;transition:transform .2s ease}" +
      ".wrap:hover{transform:scale(1.05)}" +
      ".tip{position:absolute;bottom:calc(100% + 8px);right:0;background:#0F2044;color:#fff;" +
      "padding:8px 12px;border-radius:8px;font-size:12px;font-weight:600;white-space:nowrap;" +
      "opacity:0;pointer-events:none;transition:opacity .2s;box-shadow:0 4px 16px rgba(0,0,0,.2)}" +
      ".wrap:hover .tip{opacity:1}";

    var wrap = document.createElement("div");
    wrap.className = "wrap";
    Object.keys(pos).forEach(function (k) {
      wrap.style[k] = pos[k];
    });

    var tip = document.createElement("div");
    tip.className = "tip";
    tip.textContent = cfg.rating + " ★ · " + cfg.count + " Verified Reviews";

    wrap.innerHTML = buildSvg(size);
    wrap.appendChild(tip);
    shadow.appendChild(style);
    shadow.appendChild(wrap);

    if (cfg.target) {
      var anchor = document.querySelector(cfg.target);
      if (anchor) {
        host.style.position = "relative";
        wrap.style.position = "absolute";
        wrap.style.bottom = "8px";
        wrap.style.right = "8px";
        wrap.style.top = "auto";
        wrap.style.left = "auto";
        anchor.style.position = anchor.style.position || "relative";
        anchor.appendChild(host);
        return host;
      }
    }

    document.body.appendChild(host);
    return host;
  }

  window.EarnedStarBadge = { init: mount, version: "1.0.0" };
  mount();
})();
