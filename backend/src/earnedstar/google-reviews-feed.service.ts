/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { Injectable } from '@nestjs/common';
import type { EarnedStarMerchant, EarnedStarReview } from './earnedstar.service';

@Injectable()
export class GoogleReviewsFeedService {
  buildProductReviewsXml(merchant: EarnedStarMerchant, reviews: EarnedStarReview[]): string {
    const escape = (s: string) =>
      s
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
}
