import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsUppercase,
  Length,
} from 'class-validator';
import { LessonType } from '../enum/lesson.emun';
import { QuestionType } from '@/ai/dto/ai-generate.input';

@InputType()
export class CreateLessonInput {
  @Field(() => String)
  @IsString({ message: 'Tên bài học phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên bài học không được để trống' })
  title!: string;

  @Field(() => String, { nullable: true })
  @IsString({ message: 'Mô tả bài học phải là chuỗi ký tự' })
  description?: string;

  @Field(() => String, { nullable: true })
  @IsString({ message: 'Nội dung câu hỏi phải là chuỗi ký tự' })
  content?: string;

  @Field(() => String, { nullable: true })
  @IsString({ message: 'URL video phải là chuỗi ký tự' })
  videoUrl?: string;

  @Field(() => ID, { nullable: true })
  @IsNotEmpty({ message: 'ID chương không được để trống' })
  chapterId?: number;

  @Field(() => LessonType, { nullable: true })
  @IsNotEmpty({ message: 'Loại bài học không được để trống' })
  type?: LessonType;

  @Field({ nullable: true })
  @IsString({ message: 'Link bài học phải là chuỗi ký tự' })
  link?: string;

  @Field(() => [QuestionDetailInput], { nullable: true })
  questions!: QuestionDetailInput[];

  @Field(()=>[QuestionTypeObjectInput], { nullable: true })
  questionTypeObjects?: QuestionTypeObjectInput[]
}

@InputType()
export class QuestionDetailInput {
  @Field()
  question!: string;

  @Field()
  answer!: string;

  @Field(() => [MCOptionInput], { nullable: true })
  mcOptions?: MCOptionInput[];

  @Field(() => QuestionType)
  questionType!: QuestionType;
}
@InputType()
export class MCOptionInput {
  @Field({ nullable: true })
  choice?: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class QuestionTypeObjectInput {
  @Field({ nullable: true })
  type!: string;

  @Field({ nullable: true })
  numberOfQuestions!: number;
}