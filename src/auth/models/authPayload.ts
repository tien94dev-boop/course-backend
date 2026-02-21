import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '@/user/schemas/user.schema';

@ObjectType()
export class AuthPayload {
  @Field()
  success!: boolean;

  @Field()
  message!: string;

 @Field({ nullable: true, defaultValue:"" })
  accessToken?: string;

  @Field(() => User, { nullable: true })
  user?: User;
}
