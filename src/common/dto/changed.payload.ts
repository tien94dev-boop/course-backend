import { ObjectType, Field } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class ChangedPayload {
  @Field(() => String)
  operation: string;

  @Field(() => GraphQLJSON)  // <-- Đây là key: data là JSON linh hoạt
  data: any;  // hoặc Record<string, any>, unknown
}