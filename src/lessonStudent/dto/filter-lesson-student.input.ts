import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class FilterLessonStudentInput {
  @Field(() => String, { nullable: true })
  studentId!: string;

   @Field(() => String, { nullable: true })
  lessonId!: string;
}