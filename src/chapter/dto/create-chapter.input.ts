import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

@InputType()
export class CreateChapterInput {
  @Field(() => String)
  @IsString({ message: 'Tên chương phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên chương không được để trống' })
  readonly title!: string;

  @Field(() => String, { nullable: true })
  @IsString({ message: 'Mô tả chương phải là chuỗi ký tự' })
  @IsOptional()
  readonly description?: string;

  @Field(() => String, { nullable: true })
  @IsString({ message: 'ID khóa học phải là chuỗi ký tự' })
  @IsOptional()
  readonly courseId!: string;
}
