import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@prisma/client";
import { BearerStrategy } from "passport-azure-ad";
import { UserService } from "src/user/user.service";
import { AUDIENCE, CLIENT_ID, TENANT_ID } from "../../constants";
// @ts-ignore
// eslint-disable-next-line
import { IAadUser } from "./IAadUser";
import { UserInfo } from "../UserInfo";

@Injectable()
export class AadOauthStrategy extends PassportStrategy(
  BearerStrategy,
  "oauth"
) {
  private userService: UserService;
  constructor(configService: ConfigService, userService: UserService) {
    var options = {
      identityMetadata: `https://login.microsoftonline.com/${configService.get(
        TENANT_ID
      )}/v2.0/.well-known/openid-configuration`,
      clientID: configService.get(CLIENT_ID),
      issuer: `https://sts.windows.net/${configService.get(TENANT_ID)}/`,
      audience: configService.get(AUDIENCE),
      passReqToCallback: false,
    };
    super(options);
    this.userService = userService;
  }

  async validate(response: IAadUser): Promise<UserInfo> {
    if (!response) throw new UnauthorizedException();
    const user = await this.userService.findByEmail(response.email);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
