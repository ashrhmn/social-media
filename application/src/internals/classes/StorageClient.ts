import "server-only";

import { Client, ClientOptions } from "minio";
import { RedisService } from "@/services/RedisService";
import { Inject } from "typedi";
import { extname } from "path";
import * as mime from "mime";

export class StorageClient extends Client {
  @Inject() redisService!: RedisService;
  constructor(options: ClientOptions, private readonly bucketName: string) {
    super(options);
  }

  async upload(path: string, file: File) {
    return await this.putObject(
      this.bucketName,
      path,
      Buffer.from(await file.arrayBuffer()),
      file.size,
      {
        mime: file.type,
      }
    );
  }

  async uploadPublic(path: string, file: File) {
    await this.upload(`__public__/${path}`, file);
    return this.getPublicFileUrl(path);
  }

  getPublicFileStream(path: string) {
    return this.getObject(this.bucketName, `__public__/${path}`).catch(
      (err) => {
        console.error("Error accessing file : ", err);
        return null;
      }
    );
  }

  getPublicFileUrl(path: string) {
    return `/api/public-file/${path}`;
  }

  async getFileUrl(path: string, expiresInSeconds = 300) {
    const key = `storage-presigned-url:${this.bucketName}:${path}:${expiresInSeconds}`;
    const cacheUrl = await this.redisService.client.get(key);
    if (cacheUrl) return cacheUrl;
    const ext = extname(path);
    const type = mime.getType(ext);
    const url = await this.presignedGetObject(
      this.bucketName,
      path,
      expiresInSeconds,
      {
        "Content-Type": type,
        "Content-Disposition": `inline; filename="${path}"`,
        "Cache-Control": `public, max-age=${expiresInSeconds}, immutable`,
      }
    );
    await this.redisService.client.set(key, url, { EX: expiresInSeconds });
    return url;
  }

  async getFileUrls(paths: string[], expiresInSeconds = 300) {
    const urls = await Promise.all(
      paths.map(async (path) => ({
        url: await this.getFileUrl(path, expiresInSeconds),
        path,
      }))
    );

    return urls.reduce((acc: Record<string, string>, { url, path }) => {
      acc[path] = url;
      return acc;
    }, {});
  }
}
