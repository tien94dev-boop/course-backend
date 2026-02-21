
import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsUppercase,
  Length,
} from 'class-validator';
import { CreateLessonInput } from './create-lesson.input';

@InputType()
export class UpdateLessonInput extends PartialType(CreateLessonInput) {
  @Field(() => ID)
  @IsString({ message: 'ID bài học phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'ID bài học không được để trống' })
  id!: string;
}