---
title: Edition Component Test
description: Testing the Edition component with both page-level metadata and inline usage.
keywords:
  - Test
  - Component
edition:
  type: paas
  tooltip: Applies to Adobe Commerce on Cloud projects (Adobe-managed PaaS infrastructure).
---

# Edition component test

This page demonstrates both page-level metadata and inline usage of the `<Edition/>` component. It is designed to align with badges in our ExL repos.

## Page-level edition

The edition badge at the top of this page is rendered using page-level metadata in the frontmatter.

```yaml
---
title: Cloud Service API Guide
description: Learn how to use the APIs for Adobe Commerce as a Cloud Service.
edition:
  type: saas
  tooltip: This documentation applies to Adobe Commerce as a Cloud Service
---
```

## Inline edition

You can also use the Edition component inline anywhere in your content.

```mdx
<Edition name="saas" tooltip="Available in Cloud Service" />
```

<Edition name="saas" tooltip="Applies to Adobe Commerce as a Cloud Service and Adobe Commerce Optimizer projects (Adobe-managed SaaS infrastructure)." />

This is a SaaS edition badge.

<Edition name="paas" tooltip="Applies to Adobe Commerce on Cloud projects (Adobe-managed PaaS infrastructure)." />

This is a PaaS edition badge.

<Edition name="onprem" tooltip="Applies to on-premises Adobe Commerce projects (customer-managed hosting)." />

This is an On-premises edition badge.

<Edition name="unknown" />

This is an unknown edition badge that will show the default "Create an Edition tag" text.
