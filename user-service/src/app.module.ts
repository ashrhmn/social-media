import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma.service";
import { NotificationService } from "./notification.service";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  controllers: [AppController],
  providers: [AppService, PrismaService, NotificationService],
  imports: [
    ClientsModule.register({
      isGlobal: true,
      clients: [
        {
          name: "AuthUserService",
          transport: Transport.RMQ,
          options: {
            urls: ["amqp://localhost:5672"],
            queue: "USER_QUEUE",
            queueOptions: {
              durable: false,
            },
          },
        },
      ],
    }),
  ],
})
export class AppModule {}
