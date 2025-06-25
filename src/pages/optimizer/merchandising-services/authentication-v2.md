---
title: User Authentication
edition: saas
description: Learn about REST API authentication in Adobe Commerce as a Cloud Service
keywords:
  - REST
  - Security
---
# Authentication

Adobe Commerce Optimizer REST API authentication is handled through Adobe's Identity Management Service (IMS), providing secure access to Commerce functionality through standardized OAuth 2.0 protocols. This authentication system supports both interactive user-based workflows and automated server-to-server integrations, ensuring secure and appropriate access for different use cases.

Every API request must include a bearer token in the request header:

`Authorization: Bearer {access token}`

The bearer token is generated using the credentials from the Adobe developer project for the API integration. The token is valid for 24 hours. When it expires, use the Adobe developer project credentials to [generate a new one](#generate-a-new-access-token).

<br></br>

<details>
      <summary><b>Get credentials and bearer access tokens</b></summary>

import IMSAuth from '/src/_includes/authentication/initial-auth-for-api-access.md'

<IMSAuth />

</details>

#### Generate a new access token

import GetNewToken from '/src/_includes/authentication/get-new-bearer-token.md'

<GetNewToken />