import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class FilterChapterInput {
 @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  courseId!: string;

   @Field(() => String, { nullable: true })
  teacherId!: string;
}