import "server-only";

import { AppConfig } from "@/config";
import { Channel, ChannelWrapper, connect } from "amqp-connection-manager";
import EventEmitter from "events";
import { Service } from "typedi";
import { SocketService } from "./SocketService";

@Service()
export class EventService extends EventEmitter {
  channel: ChannelWrapper;
  constructor(private readonly socketService: SocketService) {
    super();
    const _emit = this.emit.bind(this);
    const connection = connect(AppConfig.GENERIC_AMQP_URL);
    this.channel = connection.createChannel({
      name: "NotificationQueue",
      json: true,
      async setup(c: Channel) {
        c.assertExchange("NotificationQueue", "fanout", { durable: false });
        const { queue } = await c.assertQueue("", { exclusive: true });
        c.bindQueue(queue, "NotificationQueue", "");
        c.consume(queue, (msg) => {
          if (msg) {
            const { id, data } = JSON.parse(msg.content.toString());
            _emit(id, data);
            c.ack(msg);
          }
        });
        return c;
      },
    });
  }

  notifyOn(
    notifyId: string,
    err: ((ogError?: string) => string) | string,
    targetUserIds: string[] = []
  ) {
    this.on(notifyId, ({ error }: any) => {
      const messageToPublish = typeof err === "function" ? err(error) : err;
      this.socketService.emit(
        !!error
          ? "__GenericErrorNotification__"
          : "__GenericSuccessNotification__",
        messageToPublish,
        targetUserIds
      );
    });
  }

  emitSocketOn(
    notifyId: string,
    eventArgs:
      | ((ogError?: string) => { event: string; payload: any })
      | { event: string; payload: any },
    targetUserIds: string[] = []
  ) {
    this.on(notifyId, ({ error }: any) => {
      const { event, payload } =
        typeof eventArgs === "function" ? eventArgs(error) : eventArgs;
      this.socketService.emit(event, payload, targetUserIds);
    });
  }
}
