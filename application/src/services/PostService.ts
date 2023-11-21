import "server-only";

import { RmqClient } from "@/internals/classes/RmqClient";
import { Service } from "typedi";
import { AppConfig } from "@/config";

@Service()
export class PostService extends RmqClient {
  constructor() {
    super(AppConfig.GENERIC_AMQP_URL, "post_service_queue");
  }

  createPost(data: any, notifyId?: string) {
    return this.emit("CREATE_POST", data, notifyId);
  }

  updatePost(data: any, notifyId?: string) {
    return this.emit("UPDATE_POST", data, notifyId);
  }

  findManyPosts(data: any) {
    return this.send("FIND_MANY_POSTS", data);
  }

  findOnePost(data: any) {
    return this.send("FIND_ONE_POST", data);
  }

  deletePost(data: any, notifyId?: string) {
    return this.emit("DELETE_POST", data, notifyId);
  }
}
