import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsUppercase,
  Length,
} from 'class-validator';

@InputType()
export class CreateLessonStudentInput {
  @Field(() => [AnswerDetailInput], { nullable: true })
  @IsString({ message: 'Mô tả bài học phải là chuỗi ký tự' })
  answers?: [AnswerDetailInput];

  @Field(() => ID, { nullable: true })
  @IsNotEmpty({ message: 'ID chương không được để trống' })
  lessonId?: number;
}

@InputType()
export class AnswerDetailInput {
  @Field()
  questionId!: string;

  @Field()
  studentAnswer!: string;
}
