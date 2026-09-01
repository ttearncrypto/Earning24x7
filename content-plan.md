# Earning24x7 Content Plan

Content pillars for [Earning24x7 by TTEarnCrypto](https://ttearncrypto.github.io/Earning24x7/).
Target audience: website owners, bloggers, and affiliate/CPA marketers looking for
trusted, higher-than-AdSense ways to earn money online.

Rules: every article is educational (never promotional), original, and scannable.
AI-assisted content is fine, but it must pass the avoid-ai-writing and
anti-ai-writing quality gates before publishing.

---

## Pillar 1 — Ad Network Reviews

Reviews of ad networks (AdSense alternatives, CPM/CPC displays, PTC/PTP, and ad
exchange platforms). Compare payout rates, thresholds, payment methods, traffic
requirements, and fraud risk.

Keywords: ad network review, AdSense alternative, high CPM ad network, display ads,
CPM network, CPC network.

## Pillar 2 — CPA & Affiliate Marketing

Guides and reviews of CPA affiliate networks and affiliate programs. Explain how
CPA/CPL/CPS works, earnings per action, protection (anti-zero tolerance), and
compliance (disclosures, banned verticals).

Keywords: CPA affiliate network, CPA marketing, affiliate program, pay per lead,
affiliate disclosure.

## Pillar 3 — Monetization Models Explained

Nitty-gritty explainers of income models: CPC, CPM, CPA, CPL, PTC, PTP, URL
shortening, revenue sharing. Help beginners compare models before they pick one.

Keywords: what is CPC, what is CPM, PTC site, earn per 1000 impressions, URL
shortener earn money, income model.

## Pillar 4 — Blogging & Website Monetization

Guide-first content on setting up a blog or website and monetizing it (AdSense vs
alternatives, ad placement, traffic strategy). Supports the "make money blogging"
and "earn money online" searches.

Keywords: make money blogging, website monetization, AdSense approval tips, blog
traffic, Ads.txt.

## Pillar 5 — Scam Safety & Compliance

Scam detection, due-diligence checklists, payment thresholds red flags, and legal
compliance (affiliate disclosure, GDPR, AdSense policies, privacy policy, terms).

Keywords: ad network scam, is this site legit, earn money online scam, affiliate
disclosure, privacy policy.

---

## Required per-article assets

- Featured image: `assets/post-images/<slug>.webp` (1200x630) via
  `tools/generate-featured-image.mjs`. Original, branded, no stock defaults.
- Front matter: `title`, `description`, `author`, `date`, `tags`, `image`,
  optional `faq`, `toc`.
- Internal links: 2-4 links from `article-urls.txt` / `all-urls.txt`.
- Disclosure: affiliate products disclosure snippet at the end where relevant.

## Publishing checklist

1. Draft with Content Planner mode in blog-publisher.
2. Generate featured image.
3. Write front matter + body.
4. Run avoid-ai-writing audit, then seo-audit-report.
5. Verify internal links resolve against `article-urls.txt` / `all-urls.txt`.
6. Append the new post URL to `article-urls.txt`.
7. Commit + push. GitHub Pages auto-deploys.