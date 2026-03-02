import { InputType, Field, Int, ID } from '@nestjs/graphql';

@InputType()
export class RegisterCourseInput {
  @Field()
  courseId!: string;
}
