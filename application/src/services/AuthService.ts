import "server-only";

import { AppConfig } from "@/config";
import { RmqClient } from "@/internals/classes/RmqClient";
import { Service } from "typedi";

@Service()
export class AuthService extends RmqClient {
  constructor() {
    super(AppConfig.GENERIC_AMQP_URL, "AUTH_QUEUE");
  }

  getUserByToken(token: string) {
    return this.send("VALIDATE_TOKEN_MSG", { jwt: token });
  }
}
