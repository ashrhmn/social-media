import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { RpcException } from "@nestjs/microservices";
import { Prisma } from "@prisma/client";

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(args: Prisma.PostFindManyArgs) {
    return this.prisma.post.findMany(args);
  }

  async findOne(args: Prisma.PostFindFirstArgs) {
    const user = await this.prisma.post.findFirst(args);
    if (!user) throw new RpcException("Post not found");
    return user;
  }

  createPost(data: Prisma.PostCreateInput) {
    return this.prisma.post.create({ data });
  }

  updatePost({
    data,
    where,
  }: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }) {
    return this.prisma.post.update({ where, data });
  }

  deletePost(where: Prisma.PostWhereUniqueInput) {
    return this.prisma.post.delete({ where });
  }
}
