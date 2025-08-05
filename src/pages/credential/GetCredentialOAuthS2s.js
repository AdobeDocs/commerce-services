import React from 'react'
import { GetCredential } from '@adobe/gatsby-theme-aio/src/components/GetCredential';
import commerce from "./images/commerce.svg";

const GetCredentialOAuthS2s = () => {

  return (

    <GetCredential className="getCredentialContainer" templateId="6887db51a6867b6202ef2f9c" productName='Adobe Commerce Optimizer' >

      <GetCredential.SignIn title="Get credentials" paragraph="After signing in, you can create credentials that can be used to call the catalog data ingestion REST API." buttonText="Sign in" />

      <GetCredential.Form title="Get credentials" paragraph="Create credentials that you can use to call the catalog data ingestion REST API." className="formClass">

        <GetCredential.Form.CredentialName label="Credential name" description="The credential name must be unique, use alphanumeric characters, and between 6 and 45 characters long. A project will be automatically created with the same name in Adobe Developer Console." range="45" />

        <GetCredential.Form.Products label="Included products and services">
          <GetCredential.Form.Product label="Adobe Commerce Optimizer" icon={commerce} />
        </GetCredential.Form.Products>

        <GetCredential.Form.AdobeDeveloperConsole label='By checking this box, you agree to' linkText="Adobe Developer Terms of Use" href="https://wwwimages2.adobe.com/content/dam/cc/en/legal/servicetou/Adobe-Developer-Additional-Terms_en-US_20230822.pdf" />

        <GetCredential.Form.Side>
          <div style={{ display: "flex", gap: "32px", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
              <h3 className="spectrum-Heading spectrum-Heading--sizeS side-header">
                OAuth server-to-server credential
              </h3>
              <p className="spectrum-Body spectrum-Body--sizeM">
                This credential allows you to use industry standard OAuth2.0 libraries to generate access tokens using the OAuth 2.0 client credentials grant type.
              </p>
              <p className="spectrum-Body spectrum-Body--sizeM">
                This credential does not automatically return the tenant IDs associated with your Adobe Commerce Optimizer sandbox environments. You must manually copy and paste a tenant ID from the Commerce Cloud Manager into the <code>tenantID</code> field in the <strong>Try it</strong> panel below. See the <a href="https://developer.adobe.com/commerce/services/optimizer/data-ingestion/using-the-api/">Get started</a> documentation for help finding your tenant ID.
              </p>
            </div>
            <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
              <h3 className="spectrum-Heading spectrum-Heading--sizeS side-header">
                Learn more
              </h3>
              <a style={{ color: "#0265DC" }} href="https://developer.adobe.com/commerce/services/optimizer/data-ingestion/authentication/">
                Authentication documentation
              </a>
            </div>
          </div>
        </GetCredential.Form.Side>

      </GetCredential.Form>

      <GetCredential.UnknownError helpLink="https://some_help_link" helpLinkText="Get Help" className="unKnownError" />

      <GetCredential.Card title="Your credential is ready to use" developerConsoleManage="Manage on Developer Console" className="card_developer_console" devConsoleDirection="/console" isCollapsable="true">

        <GetCredential.Card.Side>
          <div style={{ display: "flex", gap: "32px", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
              <h3 className="spectrum-Heading spectrum-Heading--sizeS side-header">
                OAuth server-to-server credential
              </h3>
              <p className="spectrum-Body spectrum-Body--sizeM">
                This credential allows you to use industry standard OAuth2.0 libraries to generate access tokens using the OAuth 2.0 client credentials grant type.
              </p>
            </div>
            <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
              <h3 className="spectrum-Heading spectrum-Heading--sizeS side-header">
                Learn more
              </h3>
              <a style={{ color: "#0265DC" }} href="https://developer.adobe.com/commerce/services/optimizer/data-ingestion/authentication/">
                Authentication documentation
              </a>
            </div>
          </div>
        </GetCredential.Card.Side>

        <GetCredential.Card.Products label="Included products and services">
          <GetCredential.Card.Product label="Adobe Commerce Optimizer" icon={commerce} />
        </GetCredential.Card.Products>

        <GetCredential.Card.ProjectsDropdown label="Projects" subHeading="Only your projects that contain credentials are shown" />

        <GetCredential.Card.ManageDeveloperConsole label="Manage all your projects and credentials on Adobe Developer Console" direction='/console' />

        <GetCredential.Card.DevConsoleLink heading="Developer Console Project" />

        <GetCredential.Card.AccessToken
          helpText=""
          buttonLabel="Generate and copy token"
          heading={
            <>
              Access token
              <br />
              <br />
              <span style="font-weight:normal">
                <small>
                  Click the following button to generate an access token with the Client ID (<code>x-api-key</code>) and Organization ID (<code>x-gw-ims-org-id</code>) displayed in the <strong>Credential details</strong> section below.
                  <br />
                  <br />
                  After copying the access token, paste it into the <strong>Authorization</strong> header parameter of any API request in the <strong>Try it</strong> panel below. You only need to paste it once—after that, all other Authorization header fields in subsequent requests will be automatically populated for you.
                </small>
              </span>
            </>
          }
        />

        <GetCredential.Card.CredentialDetails heading={(<>Credential details<br/><br/> <span style="font-weight:normal"><small>This credential does not automatically return the tenant IDs associated with your Adobe Commerce Optimizer sandbox environments. You must manually copy and paste a tenant ID from the Commerce Cloud Manager into the <code>tenantID</code> field in the <strong>Try it</strong> panel below. See the <a href="https://developer.adobe.com/commerce/services/optimizer/data-ingestion/using-the-api/">Get started</a> documentation for help finding your tenant ID.</small></span></>)} orderBy="ClientId,ImsOrgID">
          <GetCredential.Card.CredentialDetails.ClientId heading="Client ID (x-api-key)" />
          <GetCredential.Card.CredentialDetails.ImsOrgID heading="Organization ID (x-gw-ims-org-id)" />
          <GetCredential.Card.CredentialDetails.Scopes heading="Scopes" scope="openid,session,AdobeID,read_organizations,additional_info.projectedProductContext" />
        </GetCredential.Card.CredentialDetails>

      </GetCredential.Card>

      <GetCredential.Return title="Previously created projects" paragraph="Select a project and access your existing credentials for Adobe Commerce Optimizer." className="card_developer_console" isCollapsable="true">

        <GetCredential.Return.Side>
          <GetCredential.Return.Side.Custom>
            <div style={{ display: "flex", gap: "30px", flexDirection: "column", width: "100%" }}>
              <h3 className='spectrum-Heading spectrum-Heading--sizeM'>Welcome back</h3>
              <p className="spectrum-Body spectrum-Body--sizeM">You can either re-use an existing credential or create a new credential.</p>
            </div>
          </GetCredential.Return.Side.Custom>
          <GetCredential.Return.Side.NewCredential heading="Need another credential?" buttonLabel="Create new credential" />
        </GetCredential.Return.Side>

        <GetCredential.Return.CredentialDetails heading={(<>Credential details<br/><br/> <span style="font-weight:normal"><small>This credential does not automatically return the tenant IDs associated with your Adobe Commerce Optimizer sandbox environments. You must manually copy and paste a tenant ID from the Commerce Cloud Manager into the <code>tenantID</code> field in the <strong>Try it</strong> panel below. See the <a href="https://developer.adobe.com/commerce/services/optimizer/data-ingestion/using-the-api/">Get started</a> documentation for help finding your tenant ID.</small></span></>)} orderBy="ClientId,ImsOrgID">
          <GetCredential.Card.CredentialDetails.ClientId heading="Client ID (x-api-key)" />
          <GetCredential.Card.CredentialDetails.ImsOrgID heading="Organization ID (x-gw-ims-org-id)" />
          <GetCredential.Card.CredentialDetails.Scopes heading="Scopes" scope="openid,session,AdobeID,read_organizations,additional_info.projectedProductContext" />
        </GetCredential.Return.CredentialDetails>

        <GetCredential.Return.ProjectsDropdown label="Projects" subHeading="Only your projects that contain credentials are shown" />

        <GetCredential.Return.ManageDeveloperConsole label="Manage all your projects and credentials on Adobe Developer Console" direction='/console/projects' />

        <GetCredential.Return.AccessToken
          helpText=""
          buttonLabel="Generate and copy token"
          heading={
            <>
              Access token
              <br />
              <br />
              <span style="font-weight:normal">
                <small>
                  Click the following button to generate an access token with the Client ID (<code>x-api-key</code>) and Organization ID (<code>x-gw-ims-org-id</code>) displayed in the <strong>Credential details</strong> section below.
                  <br />
                  <br />
                  After copying the access token, paste it into the <strong>Authorization</strong> header parameter of any API request in the <strong>Try it</strong> panel below. You only need to paste it once—after that, all other Authorization header fields in subsequent requests will be automatically populated for you.
                </small>
              </span>
            </>
          } />

        <GetCredential.Return.DevConsoleLink heading="Developer Console project" />

        <GetCredential.Return.Products label="Included products and services">
          <GetCredential.Return.Product label="Adobe Commerce Optimizer" icon={commerce} />
        </GetCredential.Return.Products>

      </GetCredential.Return>

      <GetCredential.RequestAccess
        title="Get credentials"
        paragraph="Create unique credentials that you will use to call multiple APIs from your application."
      >
        <GetCredential.RequestAccess.EdgeCase>
          <GetCredential.RequestAccess.EdgeCase.NoProduct title="Your organization does not have access to Adobe Commerce Optimizer." />
          <GetCredential.RequestAccess.EdgeCase.Type1User title="You do not have access to Adobe Commerce Optimizer. Please use another organization and try again." />
          <GetCredential.RequestAccess.EdgeCase.NotMember title="You do not have access to Adobe Commerce Optimizer. Please use another organization and try again." />
        </GetCredential.RequestAccess.EdgeCase>

        <GetCredential.RequestAccess.RestrictedAccess
          title="Restricted Access"
          buttonLabel="Request access"
        >
          <GetCredential.RequestAccess.RestrictedAccess.Products label="Included products and services">
            <GetCredential.RequestAccess.RestrictedAccess.Products.Product
              icon={commerce}
              label="Adobe Commerce Optimizer"
            />
          </GetCredential.RequestAccess.RestrictedAccess.Products>
        </GetCredential.RequestAccess.RestrictedAccess>
        <GetCredential.RequestAccess.RequestAccessSide>
          <div style={{ display: "flex", gap: "32px", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
              <h3 className="spectrum-Heading spectrum-Heading--sizeS side-header">
                OAuth server-to-server credential
              </h3>
              <p className="spectrum-Body spectrum-Body--sizeM">
                This credential allows you to use industry standard OAuth2.0 libraries to generate access tokens using the OAuth 2.0 client credentials grant type.
              </p>
            </div>
            <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
              <h3 className="spectrum-Heading spectrum-Heading--sizeS side-header">
                Learn more
              </h3>
              <a style={{ color: "#0265DC" }} href="https://developer.adobe.com/commerce/webapi/rest/authentication/">
                Authentication documentation
              </a>
            </div>
          </div>
        </GetCredential.RequestAccess.RequestAccessSide>
      </GetCredential.RequestAccess>
    </GetCredential>

  )
}

export default GetCredentialOAuthS2s;
