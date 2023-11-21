import { AppConfig } from "@/config";
import { RmqClient } from "@/internals/classes/RmqClient";
import "server-only";
import { Service } from "typedi";

@Service()
export class UserService extends RmqClient {
  constructor() {
    super(AppConfig.GENERIC_AMQP_URL, "user_service_queue");
  }

  getUserByEmail(email: string) {
    return this.send("GET_USER_BY_EMAIL", email);
  }

  createUser(data: any, notifyId?: string) {
    return this.emit("CREATE_USER", data, notifyId);
  }

  updateUser(data: any, notifyId?: string) {
    return this.emit("UPDATE_USER", data, notifyId);
  }

  getUsersByIds(ids: string[]) {
    return this.send("GET_USERS_BY_IDS", ids);
  }

  findManyUsers(options: any = {}) {
    return this.send("FIND_MANY_USERS", options);
  }

  findFirstUser(options: any = {}) {
    return this.send("FIND_FIRST_USER", options);
  }

  getAuthUserIdsFromPlatformUserIds(ids: string[]) {
    return this.send("GET_AUTH_USER_IDS_FROM_PLATFORM_USER_IDS", ids);
  }
}
