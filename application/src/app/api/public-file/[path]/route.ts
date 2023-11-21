import "reflect-metadata";

import { StorageService } from "@/services/StorageService";
import { NextRequest } from "next/server";
import Container from "typedi";
import { extname, basename } from "path";
import * as mime from "mime";
import { parse } from "url";

const storageService = Container.get(StorageService);
export async function GET(request: NextRequest) {
  const url = parse(request.url, true);
  const filePath = url.pathname?.replace("/api/public-file/", "");
  if (!filePath) return new Response(null, { status: 404 });
  const stream = await storageService
    .getPublicFileStream(filePath)
    .catch(() => null);
  if (!stream)
    return new Response(`{ "error": "File not found"  }`, { status: 404 });
  const ext = extname(filePath);
  const type = mime.getType(ext);
  const filename = basename(filePath);
  return new Response(stream as any, {
    headers: {
      "Content-Type": type!,
      "Cache-Control": "public, max-age=31536000, immutable",
      filename,
    },
  });
}
