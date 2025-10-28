---
title: Test Data Ingestion API operations
edition: saas
description: Learn how to test Data Ingestion REST API operations using the interactive Try It feature in the API Reference documentation
keywords:
  - REST
  - Services
  - Backend Development
  - Troubleshooting
---

# Test Data Ingestion API operations

The Data Ingestion API Reference includes an interactive **Try it** feature that allows you to test API operations directly from the documentation. This feature sends real requests to your Commerce Optimizer sandbox instance, making it easy to explore the API and validate your integration without writing code.

## What you can do

Using the **Try it** feature, you can:

- **Test API operations interactively**—Execute real API calls directly from the documentation
- **Customize request parameters**—Modify tenant ID, authorization headers, and request body data
- **View real-time responses**—See actual API responses including status codes, headers, and response data
- **Validate your setup**—Confirm that your credentials and tenant configuration are working correctly

<InlineAlert variant="warning" slots="text" />

Requests sent using **Try it** modify the actual data in your sandbox instance. While you can delete or restore data later, be mindful of the changes you make during testing.

## Prerequisites

Before testing the API, ensure you have:

- **Developer access** to an Adobe Commerce Optimizer (ACO) sandbox environment
- **Instance ID and tenant ID** for your ACO sandbox environment. See [Get your endpoint URL and tenant ID](using-the-api.md#base-url) for instructions
- **Basic understanding** of REST APIs and JSON format

## Step 1: Get credentials

1. Open the [Data Ingestion API Reference](https://developer.adobe.com/commerce/services/reference/rest/).

2. Locate the **Get Credentials** section at the top of the page.

3. Sign in to the Adobe Developer Console when prompted.

4. Follow the instructions to create credentials and generate an access token for API access.

   For detailed authentication steps, see [REST authentication](authentication.md).

<InlineAlert variant="info" slots="text" />

You only need to set up credentials once. However, access tokens expire after 24 hours and must be regenerated.

## Step 2: Test an API operation

Follow these steps to test any API operation using the interactive documentation:

1. **Choose an operation to test:**

   - Navigate to any endpoint in the [Data Ingestion API Reference](https://developer.adobe.com/commerce/services/reference/rest/).

   - Click **Try it** for the operation you want to test.

2.  **Configure the endpoint:** In the request template, replace the `tenantId` placeholder with your instance ID.

1. **Add authentication:** Select the **Parameters** tab, and replace the **Authorization** value with the  access token you generated in Step 1.

1. **Modify the request body** (if applicable) using the provided example as a starting point.

   - Select the **Body** tab
   - Edit the JSON request body with your own values

1. **Send the request:** Click the **Send** button to run the API call.

1. **Review the response:**
   - Check the HTTP status code (200, 201, 400, etc.)
   - Examine the response body and headers
   - Note any error messages for troubleshooting

## Example: Testing the Create Metadata operation

Here's a practical example of testing the Create Metadata endpoint:

1. Navigate to **POST /v1/catalog/attributes/metadata** in the API Reference.
2. Click **Try it**.
3. Enter your `tenantId` in the path parameter.
4. Add your access token to the Authorization header.
5. Use this sample request body:

   ```json
   [
     {
       "code": "brand",
       "source": {
         "locale": "en"
       },
       "label": "Brand",
       "dataType": "TEXT",
       "visibleIn": [
         "PRODUCT_DETAIL",
         "PRODUCT_LISTING",
         "SEARCH_RESULTS"
       ],
       "filterable": true,
       "sortable": true,
       "searchable": true,
       "searchWeight": 1,
       "searchTypes": [
         "AUTOCOMPLETE"
       ]
    }
   ]
   ```

6. Click **Send** and review the response.

## Common response codes

| Status Code | Description | Next Steps |
|-------------|-------------|------------|
| `200 OK` | Request successful | Review the response data |
| `201 Created` | Resource created successfully | Verify the created resource |
| `400 Bad Request` | Invalid request data | Check your request body format and required fields |
| `401 Unauthorized` | Authentication failed | Verify your access token is valid and properly formatted |
| `403 Forbidden` | Access denied | Ensure your credentials have the required permissions |
| `404 Not Found` | Resource or endpoint not found | Check the endpoint URL and tenant ID |
| `429 Too Many Requests` | Rate limit exceeded | Wait before making additional requests |

## Troubleshooting

### Authentication errors

**Problem**: `401 Unauthorized` response

**Solution**:

- Verify your access token is valid (tokens expire after 24 hours)
- Ensure the Authorization header format is: `{{accessToken}}`
- Check that your Adobe Developer Console project has the correct API permissions

### Invalid tenant ID

**Problem**: `404 Not Found` or tenant-related errors

**Solution**:

- Confirm you're using the correct tenant ID for your sandbox environment
- Verify the base URL includes your tenant ID: `https://na1-sandbox.api.commerce.adobe.com/{{tenantId}}`

### Request format errors

**Problem**: `400 Bad Request` response

**Solution**:

- Validate your JSON request body syntax
- Ensure all required fields are included
- Check that data types match the API specification
- Review field value constraints (e.g., valid enum values)

## Next steps

After successfully testing API operations:

1. **Integrate with your application** - Use the [Get Started guide](using-the-api.md) to implement API calls in your code
3. **Explore SDKs** - Consider using the [TypeScript](https://github.com/adobe-commerce/aco-ts-sdk) or [Java](https://github.com/adobe-commerce/aco-java-sdk) SDKs for easier integration
4. **Review limitations** - Understand [rate limits and boundaries](using-the-api.md#limitations) for production use.
