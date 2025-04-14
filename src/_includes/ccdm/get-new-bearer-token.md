Once you have the required credentials for IMS authentication, use the following cURL request to generate a new bearer token after the current token expires:

```curl
curl -X POST 'https://ims-na1.adobelogin.com/ims/token/v3' -H 'Content-Type: application/x-www-form-urlencoded' -d 'grant_type=client_credentials&client_id=<clientID>&client_secret=<clientSecret>&scope=adobeio_api,openid,AdobeID,read_organizations'
```

Replace the following placeholders with your credentials:

- `<CLIENT_ID>`: The client ID generated for your Adobe developer project
- `<CLIENT_SECRET>`: The client secret generated for your Adobe developer project

You can get these from the Adobe Developer Console project details page.
