import {
  AmqpConnectionManager,
  ChannelWrapper,
  connect,
} from "amqp-connection-manager";
import EventEmitter from "node:events";
import { v4 as uuid } from "uuid";
import type { Options } from "amqplib";
import { TimeoutError } from "@/internals/errors/TimeoutError";

export class RmqClient {
  private readonly eventEmitter = new EventEmitter();
  protected connection: AmqpConnectionManager;
  protected channel: ChannelWrapper;
  private readonly replyQueue = "amq.rabbitmq.reply-to";
  constructor(
    rmqUrl: string,
    private readonly queueName: string,
    publishTimeout = 10000
  ) {
    this.connection = connect(rmqUrl);
    this.channel = this.connection.createChannel({
      name: queueName,
      json: true,
      publishTimeout,
    });
    this.channel.consume(
      this.replyQueue,
      (message) => {
        this.eventEmitter.emit(
          this.replyEvent(message.properties.correlationId),
          message?.content.toString()
        );
      },
      { noAck: true }
    );
  }

  private replyEvent(correlationId: string) {
    return `${this.queueName}_REPLY_ID_${correlationId}`;
  }

  protected emit(pattern: string, data: any, notifyId?: string) {
    const id = notifyId || uuid();
    this.channel.publish("", this.queueName, {
      pattern,
      data,
      id,
    });
  }

  protected async send(pattern: string, data: any, timeout = 10000) {
    const correlationId = uuid();
    const options: Options.Publish = {
      correlationId,
      replyTo: "amq.rabbitmq.reply-to",
    };
    this.channel.publish(
      "",
      this.queueName,
      {
        pattern,
        data,
        id: correlationId,
      },
      options
    );

    return new Promise<any>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(
          new TimeoutError(`${pattern} Request to ${this.queueName} timed out`)
        );
      }, timeout);
      this.eventEmitter.once(this.replyEvent(correlationId), (message) => {
        clearTimeout(timeoutId);
        const response = JSON.parse(message as any);
        if (response.err) reject(response.err);
        else if (!response.response) reject(response);
        else resolve(response.response);
      });
    });
  }
}
