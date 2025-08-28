Once you have the required credentials for IMS authentication, use the following cURL request to generate a new bearer token after the current token expires:

```shell
curl --request POST \
  --url 'https://ims-na1.adobelogin.com/ims/token/v3' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' \
  --data 'client_id={{clientId}}' \
  --data 'client_secret={{clientSecret}}' \
  --data 'scope=openid,AdobeID,profile,email,commerce.aco.ingestion'
```

Replace the following placeholders with your credentials:

- `{{clientId}}`: The client ID generated for your Adobe developer project
- `{{clientSecret}}`: The client secret generated for your Adobe developer project

You can get these credentials from the Adobe Developer Console project details page. If you don't have access to the developer console, contact your system administrator for assistance.

<InlineAlert variant="info" slots="text" />

This token request provisions the required scopes for Adobe Commerce Optimizer data ingestion as listed in the `scope` parameter. For information on managing, refreshing, and revoking bearer tokens, see the [User Authentication Implementation Guide](https://developer.adobe.com/developer-console/docs/guides/authentication/UserAuthentication) in the *Adobe Developer Console documentation*.
