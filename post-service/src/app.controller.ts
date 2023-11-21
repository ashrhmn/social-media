import { Controller } from "@nestjs/common";
import { AppService } from "./app.service";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { Prisma } from "@prisma/client";
import { NotifyId } from "./notif.decorator";
import { NotificationService } from "./notification.service";
import { DefaultArgs } from "@prisma/client/runtime/library";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly notificationService: NotificationService,
  ) {}

  @MessagePattern("FIND_MANY_POSTS")
  findMany(payload: Prisma.PostFindManyArgs<DefaultArgs>) {
    return this.appService.findMany(payload);
  }

  @MessagePattern("FIND_ONE_POST")
  findOne(payload: Prisma.PostFindFirstArgs<DefaultArgs>) {
    return this.appService.findOne(payload);
  }

  @EventPattern("CREATE_POST")
  async createPost(
    @Payload() payload: Prisma.PostCreateInput,
    @NotifyId() notifyId?: string,
  ) {
    this.appService
      .createPost(payload)
      .then(() => this.notificationService.publish(notifyId, {}))
      .catch(() =>
        this.notificationService.publish(notifyId, {
          error: "Error creating post",
        }),
      );
  }

  @EventPattern("UPDATE_POST")
  async updateUser(
    @Payload()
    payload: {
      where: Prisma.PostWhereUniqueInput;
      data: Prisma.PostUpdateInput;
    },
    @NotifyId() notifyId?: string,
  ) {
    this.appService
      .updatePost(payload)
      .then(() => this.notificationService.publish(notifyId, {}))
      .catch(() =>
        this.notificationService.publish(notifyId, {
          error: "Error updating post",
        }),
      );
  }

  @EventPattern("DELETE_POST")
  deletePost(
    @Payload() payload: Prisma.PostWhereUniqueInput,
    @NotifyId() notifyId?: string,
  ) {
    return this.appService
      .deletePost(payload)
      .then(() => this.notificationService.publish(notifyId, {}))
      .catch(() =>
        this.notificationService.publish(notifyId, {
          error: "Error deleting post",
        }),
      );
  }
}
