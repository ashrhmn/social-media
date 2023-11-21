import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { ClientRMQ, RpcException } from "@nestjs/microservices";
import { Prisma, User } from "@prisma/client";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject("AuthUserService") private readonly authUserService: ClientRMQ,
  ) {}

  async getAuthUserIdsFromPlatformUserIds(ids: string[]) {
    const users = await this.prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, email: true },
    });
    const userMap = users.reduce((acc: any, user) => {
      acc[user.id] = user;
      acc[user.email] = user;
      return acc;
    }, {});
    const authUsers = await firstValueFrom(
      this.authUserService.send("GET_ALL_AUTH_USER_MSG", {
        where: {
          email: {
            in: users.map((u) => u.email),
          },
        },
      }),
    );
    return authUsers.data.reduce((acc: any, curr: any) => {
      acc[curr.email] = curr.id;
      acc[userMap[curr.email].id] = curr.id;
      return acc;
    }, {});
  }

  findManyUsers(options: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany(options);
  }

  findFirstUser(options: Prisma.UserFindFirstArgs) {
    return this.prisma.user.findFirst(options);
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new RpcException("User not found");
    return user;
  }

  async getUsersByIds(ids: string[]) {
    const users = await this.prisma.user.findMany({
      where: { id: { in: ids } },
    });
    return users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {} as Record<string, User>);
  }

  createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  updateUser({
    data,
    where,
  }: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    return this.prisma.user.update({ where, data });
  }
}
