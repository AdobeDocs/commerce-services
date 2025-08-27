---
title: REST authentication
description: Learn about REST API authentication with Adobe Commerce Optimizer.
edition: saas
noIndex: true
---

# REST authentication

Adobe Commerce Optimizer uses Adobe's Identity Management Service (IMS) with OAuth 2.0 for secure API access. This system supports both user-based workflows and automated integrations.

This guide covers direct API access using bearer tokens generated from your Adobe developer project. Tokens expire after 24 hours and can be refreshed using your project credentials.

<InlineAlert variant="info" slots="text" />

For more information about IMS user authentication for other use cases, see the [User Authentication Implementation Guide](https://developer.adobe.com/developer-console/docs/guides/authentication/UserAuthentication/implementation/) in the *Adobe Developer Console documentation*.

## Obtain IMS credentials

For direct access to the Data Ingestion API, you must authenticate using a bearer token.
`Authorization: Bearer {{accessToken}}`

This token is generated from the credentials of an Adobe developer project that is configured for API access.
The token is valid for 24 hours. When it expires, use the Adobe developer project credentials to [generate a new one](#generate-a-new-access-token).

<br></br>

<details>
      <summary><b>Get credentials and bearer access tokens</b></summary>

import IMSAuth from '/src/_includes/authentication/initial-auth-for-api-access.md'

<IMSAuth />

</details>

## Generate a new access token

import GetNewToken from '/src/_includes/authentication/get-new-bearer-token.md'

<GetNewToken />
