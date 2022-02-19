import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { UserServiceBase } from "./base/user.service.base";
import { PasswordService } from "../auth/password.service";
import { User } from "@prisma/client";
import { UserInfo } from "src/auth/UserInfo";

@Injectable()
export class UserService extends UserServiceBase {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly passwordService: PasswordService
  ) {
    super(prisma, passwordService);
  }

  async findByEmail(email: string): Promise<UserInfo | null> {
    const user = await this.findOne({
      where: { username: email },
    });
    return user;
  }

  async createIfNotExists(email: string): Promise<UserInfo> {
    const user = await this.findByEmail(email);
    if (user) return user;
    const createdUser = await this.create({
      data: {
        username: email,
        password: "",
        roles: ["user"],
      },
    });
    return createdUser;
  }
}
