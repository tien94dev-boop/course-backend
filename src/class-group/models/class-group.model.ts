import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class CourseModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  price?: number;
}
