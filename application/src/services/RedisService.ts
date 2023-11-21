import { AppConfig } from "@/config";
import {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
  createClient,
} from "redis";
import { Service } from "typedi";

@Service()
export class RedisService {
  client: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;
  constructor() {
    this.client = createClient({ url: AppConfig.REDIS_URL });
    this.client.connect();
  }
}
