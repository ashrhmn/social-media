import { Controller } from "@nestjs/common";
import { AppService } from "./app.service";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { Prisma } from "@prisma/client";
import { NotifyId } from "./notif.decorator";
import { NotificationService } from "./notification.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly notificationService: NotificationService,
  ) {}

  @MessagePattern("GET_AUTH_USER_IDS_FROM_PLATFORM_USER_IDS")
  getAuthUserIdsFromPlatformUserIds(ids: string[]) {
    return this.appService.getAuthUserIdsFromPlatformUserIds(ids);
  }

  @MessagePattern("FIND_MANY_USERS")
  findManyUsers(options: Prisma.UserFindManyArgs) {
    return this.appService.findManyUsers(options);
  }

  @MessagePattern("FIND_FIRST_USER")
  findFirstUser(options: Prisma.UserFindFirstArgs) {
    return this.appService.findFirstUser(options);
  }

  @MessagePattern("GET_USER_BY_EMAIL")
  getUserByEmail(email: string) {
    return this.appService.getUserByEmail(email);
  }

  @EventPattern("CREATE_USER")
  async createUser(
    @Payload() payload: Prisma.UserCreateInput,
    @NotifyId() notifyId?: string,
  ) {
    this.appService
      .createUser(payload)
      .then(() => this.notificationService.publish(notifyId, {}))
      .catch(() =>
        this.notificationService.publish(notifyId, {
          error: "Error creating profile",
        }),
      );
  }

  @EventPattern("UPDATE_USER")
  async updateUser(
    @Payload()
    payload: {
      where: Prisma.UserWhereUniqueInput;
      data: Prisma.UserUpdateInput;
    },
    @NotifyId() notifyId?: string,
  ) {
    this.appService
      .updateUser(payload)
      .then(() => this.notificationService.publish(notifyId, {}))
      .catch(() =>
        this.notificationService.publish(notifyId, {
          error: "Error updating profile",
        }),
      );
  }

  @MessagePattern("GET_USERS_BY_IDS")
  getUsersByIds(ids: string[]) {
    return this.appService.getUsersByIds(ids);
  }
}
