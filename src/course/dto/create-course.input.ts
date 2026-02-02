import { InputType, Field, Int, ID } from '@nestjs/graphql';

@InputType()
export class CreateCourseInput {
  @Field()
  title: string;

  @Field()
  code: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ID, { nullable: true })
  teacherId?: number;

  @Field(() => ID, { nullable: true })
  classGroupId?: number;
}
