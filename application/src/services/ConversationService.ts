import "server-only";

import { RmqClient } from "@/internals/classes/RmqClient";
import { Service } from "typedi";
import { AppConfig } from "@/config";
import { v4 } from "uuid";
import { EventService } from "./EventService";
import { redirect } from "next/navigation";

@Service()
export class ConversationService extends RmqClient {
  constructor(private readonly eventService: EventService) {
    super(AppConfig.GENERIC_AMQP_URL, "conversation_service_queue");
  }

  createMessage(data: any, notifyId?: string) {
    return this.emit("CREATE_MESSAGE", data, notifyId);
  }

  getConversationList(userId: string) {
    return this.send("GET_CONVERSATION_LIST", userId);
  }

  getGroupDetailsByIds(ids: string[]) {
    return this.send("GET_GROUP_DETAILS_BY_IDS", ids);
  }

  findManyMessages(options: any = {}) {
    return this.send("FIND_MANY_MESSAGES", options);
  }

  countMessages(options: any = {}) {
    return this.send("COUNT_MESSAGES", options);
  }

  createGroupWithMessage(
    data: {
      senderId: string;
      groupName: string;
      messageContent: string;
      participantIds: string[];
    },
    notifyId?: string
  ) {
    return this.emit("CREATE_GROUP_WITH_MESSAGE", data, notifyId);
  }

  getGroupParticipantsById(id: string) {
    return this.send("GET_GROUP_PARTICIPANTS_BY_ID", id);
  }
}
