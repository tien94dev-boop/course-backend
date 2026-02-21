import { InputType, Field, ID, Int, PartialType } from '@nestjs/graphql';
import { CreateChapterInput } from './create-chapter.input';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

@InputType()
export class UpdateChapterInput extends PartialType(CreateChapterInput) {
  @Field(() => ID)
  @IsString({ message: 'ID chương phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'ID chương không được để trống khi cập nhật' })
  id!: string;
}