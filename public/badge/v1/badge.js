/**
 * EarnedStar Badge Widget v1
 *
 * Origami SVG (default):
 *   <script src="https://earnedstar.com/badge/v1/badge.js" data-key="..." data-style="origami"></script>
 *
 * Photoreal leather star + merchant logo:
 *   <script src="https://earnedstar.com/badge/v1/badge.js"
 *     data-key="..."
 *     data-style="photo"
 *     data-color="navy"
 *     data-logo="https://merchant.com/logo.png"
 *     data-size="128"></script>
 *
 * data-color: navy | gold | white (photo style only)
 * data-logo: merchant logo URL for center circle overlay
 */
(function () {
  "use strict";

  var SCRIPT = document.currentScript;
  if (!SCRIPT) return;

  var CDN = (function () {
    var src = SCRIPT.src || "";
    var m = src.match(/^(https?:\/\/[^/]+)/);
    return m ? m[1] : "https://earnedstar.com";
  })();

  var config = {
    key: SCRIPT.getAttribute("data-key") || "demo",
    style: SCRIPT.getAttribute("data-style") || "origami",
    color: SCRIPT.getAttribute("data-color") || "navy",
    logo: SCRIPT.getAttribute("data-logo") || "",
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

  var PHOTO_SIZES = [64, 96, 128, 192, 256, 512];
  var STAR_PATH =
    "M50,6 L61,35 L91,35 L68,54 L77,82 L50,65 L23,82 L32,54 L9,35 L39,35 Z";

  function pickPhotoBucket(displayPx) {
    var target = Math.max(64, Math.ceil(displayPx * 2));
    for (var i = 0; i < PHOTO_SIZES.length; i++) {
      if (PHOTO_SIZES[i] >= target) return PHOTO_SIZES[i];
    }
    return 512;
  }

  function photoBadgeSrc(color, bucket) {
    return (
      CDN +
      "/brand/badge/earnedstar-" +
      color +
      "-photo-logo-" +
      bucket +
      ".png"
    );
  }

  function logoOverlayPx(badgePx) {
    return Math.round((badgePx * 46) / 128);
  }

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

  function buildPhotoBadge(cfg) {
    var size = cfg.size || 128;
    var color = ["navy", "gold", "white"].indexOf(cfg.color) >= 0 ? cfg.color : "navy";
    var bucket = pickPhotoBucket(size);
    var logoPx = logoOverlayPx(size);

    var html =
      '<div class="badge" style="position:relative;width:' +
      size +
      "px;height:" +
      size +
      'px">' +
      '<img src="' +
      photoBadgeSrc(color, bucket) +
      '" alt="EarnedStar badge" width="' +
      size +
      '" height="' +
      size +
      '" style="display:block;width:100%;height:100%"/>';

    if (cfg.logo) {
      html +=
        '<img src="' +
        cfg.logo +
        '" alt="" style="position:absolute;left:50%;top:50%;width:' +
        logoPx +
        "px;height:" +
        logoPx +
        'px;transform:translate(-50%,-49%);border-radius:999px;object-fit:cover"/>';
    }

    html += "</div>";
    return html;
  }

  function mount(opts) {
    opts = opts || {};
    var cfg = Object.assign({}, config, opts);
    var pos = POSITIONS[cfg.position] || POSITIONS["bottom-right"];
    var size = cfg.size || 68;
    var isPhoto = cfg.style === "photo" || cfg.style.indexOf("photo-") === 0;

    if (cfg.style.indexOf("photo-") === 0) {
      cfg.color = cfg.style.replace("photo-", "");
      isPhoto = true;
    }

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

    wrap.innerHTML = isPhoto ? buildPhotoBadge(cfg) : buildSvg(size);
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

  window.EarnedStarBadge = { init: mount, version: "1.1.0" };
  mount();
})();
