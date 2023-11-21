import { PrismaClient } from "@prisma/client";
import { Global, Injectable } from "@nestjs/common";

@Global()
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      log: ["error", "info", "warn"],
      errorFormat: "pretty",
    });
  }
}
