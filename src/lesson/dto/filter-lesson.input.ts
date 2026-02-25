import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class FilterLessonInput {
  @Field(() => String, { nullable: true })
  chapterId!: string;

   @Field(() => String, { nullable: true })
  teacherId!: string;
}