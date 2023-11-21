import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma.service";
import { NotificationService } from "./notification.service";

@Module({
  controllers: [AppController],
  providers: [AppService, PrismaService, NotificationService],
})
export class AppModule {}
