import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class CourseModel {
  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ID, { nullable: true })
  teacherId?: number;

  @Field(() => ID, { nullable: true })
  classGroupId?: number;
}
