import { Injectable, UnauthorizedException } from "@nestjs/common";
// @ts-ignore
// eslint-disable-next-line
import { UserService } from "../user/user.service";
import { UserInfo } from "./UserInfo";
import * as msal from "@azure/msal-node";
import { ConfigService } from "@nestjs/config";
import {
  BACKEND_BASE_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  SCOPES,
  TENANT_ID,
} from "src/constants";
import { AuthorizationCodeRequest } from "@azure/msal-node";

@Injectable()
export class AadOauthService {
  private scopes: string[];
  private cca: msal.ConfidentialClientApplication;
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {
    this.scopes = configService.get(SCOPES).split(" ");

    const config = {
      auth: {
        clientId: configService.get(CLIENT_ID),
        authority: `https://login.microsoftonline.com/${configService.get(
          TENANT_ID
        )}`,
        clientSecret: configService.get(CLIENT_SECRET),
      },
      system: {
        loggerOptions: {
          piiLoggingEnabled: false,
          logLevel: msal.LogLevel.Verbose,
        },
      },
    };
    this.cca = new msal.ConfidentialClientApplication(config);
  }

  async login(): Promise<string> {
    const authCodeUrlParameters = {
      scopes: this.scopes,
      redirectUri: `${this.configService.get(
        BACKEND_BASE_URL
      )}/api/aad/redirect`,
    };
    const authCodeUrl = await this.cca.getAuthCodeUrl(authCodeUrlParameters);
    return authCodeUrl;
  }
  async redirect(accessCode: string): Promise<UserInfo> {
    const tokenRequest: AuthorizationCodeRequest = {
      code: accessCode,
      scopes: [...this.scopes, "email"],
      redirectUri: `${this.configService.get(
        BACKEND_BASE_URL
      )}/api/aad/redirect`,
    };
    const result = await this.cca.acquireTokenByCode(tokenRequest);
    const idTokenClaims = result?.account?.idTokenClaims as any;
    const user = await this.userService.createIfNotExists(idTokenClaims?.email);
    return { ...user, ...{ accessToken: result?.accessToken as string } };
  }
}
