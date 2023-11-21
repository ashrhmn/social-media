import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const NotifyId = createParamDecorator(
  (_: string, ctx: ExecutionContext) => {
    try {
      return JSON.parse(
        ctx.switchToRpc().getContext().getMessage().content.toString(),
      ).id;
    } catch (error) {}
  },
);
