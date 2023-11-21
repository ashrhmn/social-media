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
  ) {
    //
  }

  @MessagePattern("GET_CONVERSATION_LIST")
  getConversationForUserId(userId: string) {
    return this.appService.getConversationForUserId(userId);
  }

  @MessagePattern("GET_GROUP_DETAILS_BY_IDS")
  getGroupDetailsByIds(ids: string[]) {
    return this.appService.getGroupDetailsByIds(ids);
  }

  @EventPattern("CREATE_MESSAGE")
  async createMessage(
    @Payload() payload: Prisma.MessageCreateInput,
    @NotifyId() notifyId?: string,
  ) {
    return await this.appService
      .createMessage(payload)
      .then(() => this.notificationService.publish(notifyId, {}))
      .catch(() =>
        this.notificationService.publish(notifyId, {
          error: "Error creating message",
        }),
      );
  }

  @MessagePattern("FIND_MANY_MESSAGES")
  findManyMessages(options: Prisma.MessageFindManyArgs) {
    return this.appService.findManyMessages(options);
  }

  @MessagePattern("CREATE_GROUP_WITH_MESSAGE")
  createGroupWithMessage(
    @Payload()
    payload: {
      senderId: string;
      groupName: string;
      messageContent: string;
      participantIds: string[];
    },
    @NotifyId() notifyId?: string,
  ) {
    this.appService
      .createGroupWithMessage(payload)
      .then((groupId) =>
        this.notificationService.publish(notifyId, { groupId }),
      )
      .catch(() =>
        this.notificationService.publish(notifyId, {
          error: "Error creating group",
        }),
      );
  }

  @MessagePattern("GET_GROUP_PARTICIPANTS_BY_ID")
  getGroupParticipantsById(id: string) {
    return this.appService.getGroupParticipantsById(id);
  }
}
