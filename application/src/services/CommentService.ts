import "server-only";

import { RmqClient } from "@/internals/classes/RmqClient";
import { Service } from "typedi";
import { AppConfig } from "@/config";

@Service()
export class CommentService extends RmqClient {
  constructor() {
    super(AppConfig.GENERIC_AMQP_URL, "comment_service_queue");
  }

  createComment(data: any, notifyId?: string) {
    return this.emit("CREATE_COMMENT", data, notifyId);
  }

  createChildComment(data: any, notifyId?: string) {
    return this.emit("CREATE_CHILD_COMMENT", data, notifyId);
  }
}
