import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateCourseInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  price?: number;
}
