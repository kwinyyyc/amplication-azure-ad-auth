import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { BACKEND_BASE_URL, UI_AUTH_CALLBACK } from "src/constants";
import * as express from "express";
import { UserService } from "src/user/user.service";
import url from "url";
import { UserInfo } from "./UserInfo";
@ApiTags("auth")
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}
  @Post("login")
  async login(): Promise<string> {
    return await this.authService.login();
  }
  // @Get("login")
  // async log2in(@Res() res: express.Response): Promise<void> {
  //   const authCodeUrl = await this.authService.login();
  //   res.redirect(`${authCodeUrl}&state=browser_login`);
  // }
  @Get("redirect")
  async redirect(
    @Req() req: express.Request,
    @Res() res: express.Response
  ): Promise<void> {
    const user = await this.authService.redirect(req.query.code as string);
    // // if it is GET request from browser go back to swagger
    // if (req.query.state === "browser_login") {
    //   res.redirect(
    //     url.format({
    //       pathname: `${this.configService.get(BACKEND_BASE_URL)}/api`,
    //     })
    //   );
    //   return;
    // }
    // // if it is POST request from UI go back to UI
    const uiAuthCallback = this.configService.get(UI_AUTH_CALLBACK);
    res.redirect(
      url.format({
        pathname: uiAuthCallback,
        query: {
          user: JSON.stringify(user),
        },
      })
    );
  }
}
