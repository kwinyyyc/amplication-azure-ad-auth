import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { BearerStrategy } from "passport-azure-ad";
import { UserService } from "src/user/user.service";
import { AUDIENCE, CLIENT_ID, TENANT_ID } from "../../constants";
// @ts-ignore
// eslint-disable-next-line
import { IAadUser } from "../IAadUser";

@Injectable()
export class JwtStrategy extends PassportStrategy(BearerStrategy, "oauth") {
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

  async validate(response: IAadUser) {
    if (!response) throw new UnauthorizedException();
    const user = await this.userService.findOne({
      where: { username: response.email },
    });
    if (user) return { response, ...{ roles: user.roles } };
    const createdUser = await this.userService.create({
      data: {
        username: response.email,
        password: "",
        roles: ["user"],
      },
    });
    return { response, ...{ roles: createdUser.roles } };
  }
}
