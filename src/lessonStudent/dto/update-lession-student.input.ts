import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsUppercase,
  Length,
} from 'class-validator';
import { CreateLessonStudentInput } from './create-lesson-student.input';

@InputType()
export class UpdateLessonStudentInput extends PartialType(
  CreateLessonStudentInput,
) {
  @Field(() => ID)
  @IsString({ message: 'ID bài học phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'ID bài học không được để trống' })
  id!: string;
}
