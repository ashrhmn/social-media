import { ChannelWrapper, connect } from "amqp-connection-manager";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService {
  channel: ChannelWrapper;
  constructor() {
    const connection = connect(process.env.RMQ_URL || "amqp://localhost");
    const channel = connection.createChannel({
      name: "NotificationQueue",
      json: true,
    });
    this.channel = channel;
  }

  async publish(id?: string, data?: any) {
    if (!id) return;
    this.channel.publish("NotificationQueue", "", { id, data });
  }
}
