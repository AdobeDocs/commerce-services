- &#8203;<Edition name="paas" /> **Adobe Commerce on Cloud infrastructure and Adobe Commerce on-premises deployments**

- Testing: `https://catalog-service-sandbox.adobe.io/graphql`
- Production: `https://catalog-service.adobe.io/graphql`

- &#8203;<Edition name="saas" /> **Adobe Commerce as a Cloud Service deployments**

  ```text
  https://na1-sandbox.api.commerce.adobe.com/{{tenant-id}}/graphql
  ```

  The URL structure is:

  `https://<region>-<environment>.api.commerce.adobe.com/<tenantId>`

   - `<region>` is the cloud region where your instance is deployed.
   - `<environment>` is the environment type, such as `sandbox`. If the environment is production, this value is omitted.
   - `<tenantId>` is the unique identifier for your organization's specific instance within the Adobe Experience Cloud.
