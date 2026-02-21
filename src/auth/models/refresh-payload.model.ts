import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class RefreshPayload {
  @Field()
  success!: string;

  @Field()
  message!: string;

  @Field({ nullable: true })
  accessToken?: string;
}
