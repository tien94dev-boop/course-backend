import { Type } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';

export function BaseResponse<T>(ItemType: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class ResponseClass {
    @Field(() => Boolean)
    success: boolean = false;

    @Field(() => String, { nullable: true })
    message?: string;

    @Field(() => ItemType, { nullable: true })
    data?: T | null;
  }
  return ResponseClass;
}