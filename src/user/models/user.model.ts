import { ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '@/common/models/base-response.output';
import { User } from '@/user/schemas/user.schema';

@ObjectType()
export class UserMutationResponse extends BaseResponse(User) {}