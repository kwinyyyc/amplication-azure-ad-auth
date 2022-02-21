import { AuthGuard } from "@nestjs/passport";

export class AadOauthGuard extends AuthGuard("oauth") {}
