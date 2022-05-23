import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator(
  (_data, context: ExecutionContext): User => {
    const graqhqlContext = GqlExecutionContext.create(context);
    const ctx = graqhqlContext.getContext();

    return ctx.req.user;
  },
);
