# Server-to-Server Integration Guide

## Overview

This guide provides practical steps for implementing Server-to-Server (S2S) integration with Adobe Commerce Cloud Services (ACCS) APIs using OAuth Server-to-Server authentication. S2S integration enables automated system-to-system communication without user intervention, ideal for:

- Background processes and automated tasks
- Data synchronization services
- Automated reporting systems
- Microservices architecture integration

## Prerequisites

Before starting implementation, ensure you have:

- Access to [Adobe Developer Console](https://developer.adobe.com/console)
- An Adobe Organization Admin account
- Completed the [Server Authentication Setup](./server-auth.md)
- A development environment with:
  - HTTP client library
  - Environment variables or secure secrets management
  - SSL/TLS support
  - JSON parsing capabilities

## Implementation Steps

### 1. Set Up OAuth Server-to-Server Credential

If you have already completed the [Server Authentication Setup](./server-auth.md) as mentioned in prerequisites, you can skip this step. Otherwise, follow these steps:

1. Navigate to your project in Adobe Developer Console
2. Add OAuth Server-to-Server credentials to your project
3. Provide a credential name (helps identify the credential in Adobe Admin Console)
4. Note down:
   - Client ID
   - Client Secret
   - Organization ID

### 2. Configure Your Environment

Create a `.env` file (add to .gitignore):

```plaintext
IMS_CLIENT_ID=your_client_id
IMS_CLIENT_SECRET=your_client_secret
IMS_ORG_ID=your_org_id
```

### 3. Implement Token Generation

Below is an example implementation using JavaScript/Node.js. You can implement similar logic in your preferred programming language.

```javascript
// tokenManager.js
const axios = require('axios');
require('dotenv').config();

class TokenManager {
  constructor() {
    this.token = null;
    this.tokenExpiry = null;
  }

  async getValidToken() {
    if (this.isTokenValid()) {
      return this.token;
    }
    return await this.generateToken();
  }

  isTokenValid() {
    return this.token && this.tokenExpiry && Date.now() < this.tokenExpiry;
  }

  async generateToken() {
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://ims-na1.adobelogin.com/ims/token/v3',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: new URLSearchParams({
          client_id: process.env.IMS_CLIENT_ID,
          client_secret: process.env.IMS_CLIENT_SECRET,
          grant_type: 'client_credentials',
          scope: 'openid,AdobeID,email,profile,additional_info.roles,additional_info.projectedProductContext'  // required scopes
        })
      });

      this.token = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      return this.token;
    } catch (error) {
      console.error('Token generation failed:', error.message);
      throw error;
    }
  }
}
```

### 4. Create ACCS API Client

Below is an example implementation of an API client using JavaScript/Node.js. You can implement similar logic in your preferred programming language while following the same principles.

```javascript
// accsClient.js
const axios = require('axios');
const TokenManager = require('./tokenManager');

class ACCSApiClient {
  constructor() {
    this.baseURL = process.env.API_ENDPOINT;
    this.tokenManager = new TokenManager();
  }

  async request(method, endpoint, data = null) {
    const accessToken = await this.tokenManager.getValidToken();
    
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'x-api-key': process.env.IMS_CLIENT_ID,
      'x-gw-ims-org-id': process.env.IMS_ORG_ID,
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios({
        method,
        url: `${this.baseURL}${endpoint}`,
        headers,
        data,
        validateStatus: status => status < 500
      });

      if (response.status === 429) {
        // Handle rate limiting
        const retryAfter = response.headers['retry-after'] || 5;
        await this.sleep(retryAfter * 1000);
        return this.request(method, endpoint, data);
      }

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response?.status === 401) {
      this.tokenManager.token = null;
    }
    throw error;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 5. Usage Example

Below is an example implementation showing how to use the API client with JavaScript/Node.js. You can adapt this example to your preferred programming language and specific use case.

```javascript
// example-usage.js
const ACCSApiClient = require('./accsClient');

async function main() {
  const client = new ACCSApiClient();
  
  try {
    // Example API call using a real Magento REST API endpoint
    const response = await client.request('GET', '/rest/V1/products');
    console.log('Products:', response);

    // Another example with a specific product SKU
    const productSku = 'example-sku';
    const productDetails = await client.request('GET', `/rest/V1/products/${productSku}`);
    console.log('Product Details:', productDetails);
  } catch (error) {
    console.error('API call failed:', error.message);
  }
}
```

## Best Practices

### Security

Store all sensitive credentials and secrets in a secure environment variable system or dedicated secrets management service, never in your codebase. Implement regular client secret rotation to minimize security risks. Use environment variables for all configuration values to maintain flexibility across different environments. Maintain comprehensive error logs with appropriate security context while being careful not to expose sensitive information.

### Performance

Implement token caching to reuse valid access tokens until they approach expiration, reducing unnecessary token generation requests. Use connection pooling in your HTTP client to efficiently manage multiple concurrent requests and reduce resource overhead.

### Monitoring

Set up comprehensive logging for API response times to track performance trends and identify potential issues early. Implement monitoring for token refresh events to detect authentication-related problems.
