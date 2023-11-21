import "server-only";

import { StorageClient } from "@/internals/classes/StorageClient";
import { Service } from "typedi";
import { AppConfig } from "@/config";

@Service()
export class StorageService extends StorageClient {
  constructor() {
    super(
      {
        endPoint: AppConfig.STORAGE_SERVICE_ENDPOINT,
        port: AppConfig.STORAGE_SERVICE_PORT,
        useSSL: AppConfig.STORAGE_SERVICE_USE_SSL,
        accessKey: AppConfig.STORAGE_SERVICE_ACCESS_KEY,
        secretKey: AppConfig.STORAGE_SERVICE_SECRET_KEY,
      },
      AppConfig.STORAGE_SERVICE_BUCKET_NAME
    );
  }
}
