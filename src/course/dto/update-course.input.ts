import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCourseInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  code: string;

  @Field(() => ID, { nullable: true })
  teacherId?: number;

  @Field(() => ID, { nullable: true })
  classGroupId?: number;
}
