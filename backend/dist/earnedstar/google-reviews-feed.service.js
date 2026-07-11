"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleReviewsFeedService = void 0;
const common_1 = require("@nestjs/common");
let GoogleReviewsFeedService = class GoogleReviewsFeedService {
    buildProductReviewsXml(merchant, reviews) {
        const escape = (s) => s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
        const reviewNodes = reviews
            .filter((r) => r.status === 'published' && r.review_text)
            .slice(0, 50)
            .map((r) => {
            const date = r.created_at.slice(0, 10);
            return `    <review>
      <review_id>${escape(r.id)}</review_id>
      <reviewer>
        <name>${escape(r.customer_name)}</name>
      </reviewer>
      <review_timestamp>${date}</review_timestamp>
      <content>${escape(r.review_text ?? '')}</content>
      <review_url>${escape(`https://earnedstar.com/store/${merchant.slug}#review-${r.id}`)}</review_url>
      <ratings>
        <overall min="1" max="5">${r.rating_overall}</overall>
      </ratings>
      <products>
        <product>
          <product_ids>
            <skus>
              <sku>${escape(r.order_id ?? merchant.slug)}</sku>
            </skus>
          </product_ids>
          <product_name>${escape(merchant.name)}</product_name>
          <product_url>${escape(merchant.website_url ?? `https://earnedstar.com/store/${merchant.slug}`)}</product_url>
        </product>
      </products>
    </review>`;
        })
            .join('\n');
        return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:vc="http://www.w3.org/2007/XMLSchema-versioning"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="http://www.google.com/shopping/reviews/schema/product/2.3/product_reviews.xsd">
  <version>2.3</version>
  <aggregator>
    <name>EarnedStar</name>
  </aggregator>
  <publisher>
    <name>${escape(merchant.name)}</name>
    <favicon>https://earnedstar.com/apple-icon</favicon>
  </publisher>
  <reviews>
${reviewNodes}
  </reviews>
</feed>`;
    }
};
exports.GoogleReviewsFeedService = GoogleReviewsFeedService;
exports.GoogleReviewsFeedService = GoogleReviewsFeedService = __decorate([
    (0, common_1.Injectable)()
], GoogleReviewsFeedService);
//# sourceMappingURL=google-reviews-feed.service.js.map