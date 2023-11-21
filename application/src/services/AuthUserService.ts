import "server-only";

import { AppConfig } from "@/config";
import { RmqClient } from "@/internals/classes/RmqClient";
import { Service } from "typedi";

@Service()
export class AuthUserService extends RmqClient {
  constructor() {
    super(AppConfig.GENERIC_AMQP_URL, "USER_QUEUE");
  }

  async getSessionTokensByUserIds(ids: string[]): Promise<string[]> {
    return this.send("GET_MANY_SESSION_MSG", {
      where: { authUserId: { in: ids } },
      select: { token: true },
    }).then((res) => (res as any)?.data?.map((i: any) => i.token));
  }

  async getOneAuthUser(options: any) {
    return this.send("GET_ONE_AUTH_USER_MSG", options);
  }

  getAllAuthUsers(options: any = {}) {
    return this.send("GET_ALL_AUTH_USER_MSG", options);
  }
}
