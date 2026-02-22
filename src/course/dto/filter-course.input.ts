import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CourseFilterInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ID, { nullable: true })
  teacherId?: number;

  // @Field(() => ID, { nullable: true })
  // classGroupId?: number;
}
