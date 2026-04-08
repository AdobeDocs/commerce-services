# Adobe Commerce Release Notes Writing Guidelines

Use these guidelines to write consistent, high-quality release notes for Adobe Commerce products. The [Adobe Commerce 2.4.9-beta1 release notes](https://experienceleague.adobe.com/en/docs/commerce-operations/release/notes/adobe-commerce/2-4-9) serve as the reference model.

---

## 1. Document Structure

### 1.1 Top-Level Organization

Divide every release notes document into two primary sections:

- **Highlights** — New features, enhancements, and notable changes
- **Fixed Issues** — Bug fixes and resolved problems

Both sections must be organized into **consistent functional categories** (e.g., APIs, Admin UI, Catalog, Cart & Checkout, GraphQL, Security, Performance). Use the same category taxonomy across releases for navigability.

### 1.2 Metadata Header

Always include:

- **Title** formatted as: `Adobe Commerce X.Y.Z release notes`
- **Last updated** date
- **Audience badges** (e.g., Experienced, Admin, Developer)
- **Applicability labels** where relevant (e.g., PaaS only, Cloud only)

---

## 2. Highlights Section

### 2.1 Purpose

The Highlights section captures significant new capabilities. Entries here set merchant and developer expectations before they read the full changelog.

### 2.2 Entry Format

Each highlight entry must follow this pattern:

```
#### [Brief Feature Title]

[One to three sentences describing the new capability and its business value.
Lead with the customer benefit, not the implementation detail.]

_TICKET-ID_
```

**Example (good):**

> #### REST API product gallery inheritance control at store view level
>
> Updating a product via REST API in a store scope no longer causes product images and videos to inherit changes from global scope when `media_gallery_entries` is omitted from the payload or set to `NULL`. It is now also possible to restore scope inheritance for product images and videos via REST API by setting the corresponding field to `NULL`.
>
> _ACP2E-4358 - GitHub code contribution_

### 2.3 Writing Rules for Highlights

- **Lead with the outcome**, not the mechanism. Describe what the merchant or developer can now do.
- Use **present tense** for the new behavior.
- Keep entries to 1–4 sentences. If more context is needed, link to documentation.
- Group related highlights under a named sub-category heading (e.g., `### APIs`, `### Platform and infrastructure`).

---

## 3. Fixed Issues Section

### 3.1 Entry Format

Each bug fix entry must follow this pattern:

```
#### [Concise Problem Title]

[Description of the fix using a before/after pattern:
"Fixed issue where... Now, ..."]

_TICKET-ID - [optional: GitHub issue / GitHub code contribution]_
```

### 3.2 The Before/After Pattern

This is the most critical writing convention. Every fix entry must answer three questions:

| Question | How to express it |
|---|---|
| What was broken? | "Fixed an issue where..." / "Resolved a problem where..." |
| What was the impact on the user? | Describe the symptom the user experienced |
| What is the behavior now? | "Now, ..." (present tense) |

**Example (good):**

> #### Special price is not showing correctly for Configurable product's child product
>
> Fixed an issue where the special price for a configurable product's child (simple) product was not displayed correctly on the product listing page when "Used in Product Listing" was set to No. Now, the special price is shown properly along with the regular price, ensuring consistent pricing display across product types.
>
> _AC-13594 - GitHub code contribution_

**Example (avoid):**

> #### Fixed configurable product special price
>
> Changed how special prices are displayed. Bug was in the listing logic.

### 3.3 Title Conventions for Fixed Issues

- Write titles as **noun phrases describing the problem**, not the solution
  - Good: `"Category tree in admin is not expanded to show all selected nested categories from level 3"`
  - Avoid: `"Fixed category tree expansion in admin"`
- Use sentence case (capitalize first word and proper nouns only)
- Keep titles under 12 words where possible
- Include the affected component or page when it aids scanning (e.g., `Admin`, `GraphQL`, `REST API`, `Storefront`)

---

## 4. Language and Tone

### 4.1 Voice

Use **active voice** and **third-person neutral** throughout.

- Good: `"The system now validates the selected shipping method..."`
- Avoid: `"We fixed the shipping method validation..."`

### 4.2 Tense Convention

| Context | Tense |
|---|---|
| Describing previous (broken) behavior | Past tense: "Previously, ..." / "Before the fix, ..." |
| Describing current (fixed) behavior | Present tense: "Now, ..." / "After the fix, ..." |
| Describing new features | Present tense throughout |

### 4.3 Consistent Opening Phrases

Use these sentence openers consistently.

**For fixes:**

- `Fixed an issue where...`
- `Resolved an issue where...`
- `Corrected a problem where...`
- `Fixed issue where...` (acceptable shorthand)

**For before/after contrast:**

- `Previously, ... Now, ...`
- `Before the fix, ... After the fix, ...`
- `Prior to the fix, ... Now, after the fix, ...`

**For features:**

- `[Feature] now supports...`
- `[Feature] has been updated to...`
- `A new [feature] is introduced for...`

### 4.4 Prohibited Phrases

Avoid these vague or non-informative phrases:

- "Various improvements have been made"
- "Bug fixes and performance improvements"
- "The system is working as expected" *(alone without context)*
- "Fixed the issue" *(without describing what the issue was)*
- Technical jargon without explanation (e.g., referencing internal class names without context)

---

## 5. Ticket Reference Format

Every entry must include a ticket reference at the end, formatted as an italicized line:

```
_AC-XXXXX_
_ACP2E-XXXXX_
_BUNDLE-XXXX_
_AC-XXXXX - GitHub issue_
_AC-XXXXX - GitHub code contribution_
_ACP2E-XXXX - GitHub issue - GitHub code contribution_
```

Rules:

- Use `- GitHub issue` when linking to a community-reported issue
- Use `- GitHub code contribution` when a community member contributed the code
- Multiple ticket IDs for one fix are separated by `, `
- Place the ticket line **after** the description, separated by a blank line

---

## 6. Category and Cross-Referencing

### 6.1 Cross-Component Fixes

When a fix touches multiple components (e.g., GraphQL + Inventory), list it under the **most specific relevant category**. Use compound categories only when the issue genuinely spans both:

- `### GraphQL, Inventory / MSI` (compound category for cross-cutting issues)
- `### Cart & Checkout, GraphQL`

### 6.2 Category Ordering

Order categories alphabetically within each top-level section (Highlights and Fixed Issues) to aid navigation.

### 6.3 Sub-categories in Highlights

In the Highlights section, use `###` sub-headings to group related highlights (e.g., `### APIs`, `### Braintree`, `### Security`). Fixed issues use only `####` entry headings under `###` category headings.

### 6.4 Standard Category Taxonomy

Use these standard category names for consistency across releases:

| Category | Use for |
|---|---|
| APIs | REST API and general web API changes |
| Admin UI | Changes to the Commerce Admin interface |
| B2B | Business-to-business features |
| Cart & Checkout | Shopping cart, checkout flow, payments at checkout |
| Catalog | Products, categories, attributes, pricing display |
| Content | CMS pages, blocks, Page Builder, media gallery |
| Framework | Core platform, Composer, PHP compatibility, cron |
| GraphQL | GraphQL schema and resolver changes |
| Import / Export | Bulk data import and export features |
| Inventory / MSI | Stock management, sources, reservations |
| Order | Order creation, management, invoicing, shipments |
| Performance | Speed, caching, memory, query optimization |
| Pricing | Price rules, discounts, tax, special prices |
| Search | Elasticsearch, OpenSearch, catalog search |
| Security | Authentication, authorization, input validation, CSP |
| SEO | URL rewrites, sitemaps, meta data |
| Shipping | Carriers, shipping methods, labels |
| Staging & Preview | Content staging, scheduled updates |
| Tax | Tax rules, FPT, VAT, credit memo tax |

---

## 7. Security Entries

Security-related fixes require extra care in disclosure:

- **Do not reveal** exploit mechanisms, attack vectors, or vulnerable code paths
- Describe the fix in terms of the protection it provides, not the vulnerability it closes
- Where a CVE exists, reference it by number
- Use neutral language: "Resolved a security issue where..." or "Strengthened validation for..."

**Example:**

> #### CAPTCHA validation now enforced for REST and GraphQL APIs
>
> When CAPTCHA (or reCAPTCHA) is enabled for the Create Account form, the same CAPTCHA validation is now enforced for customer account creation via REST and GraphQL APIs.
>
> _AC-16245_

---

## 8. Performance Entries

Performance entries should include **quantifiable or descriptive context** where possible:

- Reference the specific operation affected (e.g., "category loading," "bulk async endpoints")
- Describe the root cause if safe to disclose (e.g., "caused by redundant DB calls," "due to nested loops")
- Avoid vague claims like "improved performance significantly" without context

**Example:**

> #### Category loading performance significantly degraded
>
> The category loading performance has been significantly improved. Previously, it took so long to load categories that a timeout issue occurred.
>
> _ACP2E-3891 - GitHub code contribution_

---

## 9. Entry Length Guidelines

| Entry Type | Recommended Length |
|---|---|
| Highlight (new feature) | 2–4 sentences |
| Bug fix (simple) | 1–3 sentences |
| Bug fix (complex, multi-area) | 3–6 sentences |
| Security fix | 1–3 sentences (concise by design) |
| Performance fix | 2–4 sentences with root cause context |

- Avoid entries under one sentence — they lack sufficient context.
- Avoid entries over six sentences — link to documentation for deeper explanation instead.

---

## 10. Quality Checklist

Before publishing a release notes entry, verify:

- [ ] Title is a noun phrase describing the problem or feature (not the fix)
- [ ] Description uses before/after structure for bug fixes
- [ ] New behavior is stated in present tense
- [ ] Old behavior is stated in past tense with "Previously, ..."
- [ ] Entry is under the correct functional category
- [ ] Ticket ID is included and correctly formatted
- [ ] GitHub contribution is credited where applicable
- [ ] No internal jargon, class names, or database table names exposed without context
- [ ] No sensitive security details disclosed
- [ ] Entry is self-contained — a reader unfamiliar with the bug can understand it
- [ ] Spelling and grammar have been reviewed

---

## 11. Quick-Reference Examples

### New Feature (Highlight)

```markdown
#### Apple Pay on Chrome and Firefox

Apple Pay can now be used on Chrome and Firefox, not just Safari. When Apple Pay
Express is enabled, Apple Pay buttons are available across supported storefront
locations, and customers complete payment by scanning a code with their iPhone.

_BUNDLE-3478_
```

### Bug Fix (simple)

```markdown
#### Wishlist count not displayed on homepage

Fixed issue where the wishlist count appeared as empty parentheses on non-wishlist
pages. Now, the correct wishlist item count is displayed next to "My Wish List"
across all pages.

_AC-14607 - GitHub issue - GitHub code contribution_
```

### Bug Fix (complex)

```markdown
#### Duplicate order found for same customer in Multishipping

Concurrent requests to place an order with multiple shipping addresses no longer
result in duplicated orders for the same customer. Previously, simultaneous checkout
requests from the same session could bypass deduplication logic and create multiple
identical orders. Now, concurrent requests are serialized to prevent duplicate order
creation.

_ACP2E-4117 - GitHub code contribution_
```

### Security Fix

```markdown
#### Customer password reset through GraphQL does not honor restrictions

Resolved an issue where customer password reset requests made through GraphQL
mutations did not comply with the password reset restrictions configured under
Store > Configuration > Customers > Customer Configuration > Password Options.
These settings are now correctly enforced.

_ACP2E-3992 - GitHub code contribution_
```
