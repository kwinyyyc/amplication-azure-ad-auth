This project was generated with [Amplication](https://amplication.com)

It consists of two packages:

### [Server](./server/README.md)

### [Admin UI](./admin-ui/README.md)

### Learn more

You can learn more in the [Amplication documentation](https://docs.amplication.com/guides/getting-started).

### Azure AD implicit grant flow for swagger
1. Create application on Azure AD with a "Web" platform, add redirect url "https://localhost:3000/api/redirect"
2. Create a client secret under "Certificates & secrets"
3. in `swagger.ts` use 
```ts
export const swaggerDocumentOptions = swaggerImplicitGrantFlowDocumentOptions;
export const swaggerSetupOptions = swaggerImplicitGrantFlowSetupOptions;
```
4. Create a `.env.development.local` under the server folder with below values
```
TENANT_ID=YOUR AZURE TENANT ID
CLIENT_ID=YOUR APP CLIENT ID CREATED IN STEP 1
CLIENT_SECRET=YOUR APP CLIENT SECRET CREATED IN STEP 2
SCOPES=api://{{YOUR APP CLIENT ID}}/.default
AUDIENCE=api://{{YOUR APP CLIENT ID}}
```

### Azure AD Authorization Code with PKCE Flow for swagger
1. Create 2 applications on Azure AD. One for UI, one for API
2. In the API Azure AD application, create a client secret under "Certificates & secrets"
3. In the API Azure AD application, in a "Web" platform, add redirect url "https://localhost:3000/api/redirect"
4. In "Expose an API" > "Authorized client application", add the UI Azure AD application
5. in `swagger.ts` use 
```ts
export const swaggerDocumentOptions = swaggerPkceFlowDocumentOptions;
export const swaggerSetupOptions = swaggerPkceFlowSetupOptions;
```
6. Create a `.env.development.local` under the server folder with below values
```
TENANT_ID=YOUR AZURE TENANT ID
CLIENT_ID=YOUR API CLIENT ID CREATED IN STEP 1
CLIENT_SECRET=YOUR APP CLIENT SECRET CREATED IN STEP 2
SCOPES=api://{{YOUR API CLIENT ID}}/.default
AUDIENCE=api://{{YOUR API CLIENT ID}}
SWAGGER_CLIENT_ID=YOUR UI CLIENT ID CREATED IN STEP 1
```