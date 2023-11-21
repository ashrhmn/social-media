import "server-only";

import { ChannelWrapper, connect } from "amqp-connection-manager";
import { Service } from "typedi";
import { AuthUserService } from "./AuthUserService";
import { AppConfig } from "@/config";

@Service()
export class SocketService {
  channel: ChannelWrapper;
  constructor(private readonly authUserService: AuthUserService) {
    this.channel = connect(AppConfig.SOCKET_ADAPTER_AMQP_URL).createChannel({
      json: true,
    });
  }

  async emit(event: string, payload: any, userIds: string[] = []) {
    if (userIds.length === 0)
      return this.channel.publish(AppConfig.SOCKET_ADAPTER_AMQP_EXCHANGE, "", {
        event,
        payload,
      });
    const tokens = await this.authUserService.getSessionTokensByUserIds(
      userIds
    );
    return this.channel.publish(AppConfig.SOCKET_ADAPTER_AMQP_EXCHANGE, "", {
      tokens,
      event,
      payload,
    });
  }
}
