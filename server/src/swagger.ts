import { DocumentBuilder, SwaggerCustomOptions } from "@nestjs/swagger";

export const swaggerPath = "api";

const swaggerImplicitGrantFlowDocumentOptions = new DocumentBuilder()
  .setTitle("Sample app")
  .setDescription("Swagger API Doc")
  .setVersion("V1")
  .addOAuth2(
    {
      type: "oauth2",
      flows: {
        implicit: {
          authorizationUrl: `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/authorize`,
          tokenUrl: `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
          scopes: {
            [process.env.SCOPES as string]: "default scope",
          },
        },
      },
    },
    "oauth-swagger"
  )
  .build();

const swaggerPkceFlowDocumentOptions = new DocumentBuilder()
  .setTitle("Sample app")
  .setDescription("Swagger API Doc")
  .setVersion("V1")
  .addOAuth2(
    {
      type: "oauth2",
      flows: {
        authorizationCode: {
          authorizationUrl: `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/authorize`,
          tokenUrl: `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
          scopes: {
            [process.env.SCOPES as string]: "default scope",
          },
        },
      },
    },
    "oauth-swagger"
  )
  .build();

const swaggerImplicitGrantFlowSetupOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    oauth2RedirectUrl: `${process.env.BACKEND_BASE_URL}/${swaggerPath}/oauth2-redirect.html`,
    oauth: {
      clientId: process.env.CLIENT_ID,
    },
  },
  customCssUrl: "../swagger/swagger.css",
  customfavIcon: "../swagger/favicon.png",
  customSiteTitle: "Sample app",
};

const swaggerPkceFlowSetupOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    oauth2RedirectUrl: `${process.env.BACKEND_BASE_URL}/${swaggerPath}/oauth2-redirect.html`,
    oauth: {
      usePkceWithAuthorizationCodeGrant: true,
      clientId: process.env.SWAGGER_CLIENT_ID,
    },
  },
  customCssUrl: "../swagger/swagger.css",
  customfavIcon: "../swagger/favicon.png",
  customSiteTitle: "Sample app",
};

export const swaggerDocumentOptions = swaggerImplicitGrantFlowDocumentOptions;
export const swaggerSetupOptions = swaggerImplicitGrantFlowSetupOptions;
// export const swaggerDocumentOptions = swaggerPkceFlowDocumentOptions;
// export const swaggerSetupOptions = swaggerPkceFlowSetupOptions;
