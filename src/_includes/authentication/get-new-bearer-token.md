Once you have the required credentials for IMS authentication, use the following cURL request to generate a new bearer token after the current token expires:

```shell
curl --request POST \
  --url 'https://ims-na1.adobelogin.com/ims/token/v3' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' \
  --data 'client_id=d968818f6be344c38ac6ddba423da0e2' \
  --data 'client_secret=p8e-ntN1vFebiYPm-y_FxxGXEpKuu3Ul8ksL' \
  --data 'scope=adobeio_api,openid,AdobeID,read_organizations'
```

Replace the following placeholders with your credentials:

- `<client_id>`: The client ID generated for your Adobe developer project
- `<client_secret>`: The client secret generated for your Adobe developer project

You can get these credentials from the Adobe Developer Console project details page. If you don't have access to the developer console, contact your system administrator to get the credentials.
