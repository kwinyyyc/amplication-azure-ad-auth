import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Request } from "express";
import { AadOauthGuard } from "./aad-oauth/aadOauth.guard";
// @ts-ignore
// eslint-disable-next-line

export class GqlDefaultAuthGuard extends AadOauthGuard {
  // This method is required for the interface - do not delete it.
  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<{ req: Request }>().req;
  }
}
