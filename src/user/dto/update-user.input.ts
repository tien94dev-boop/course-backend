import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsUppercase,
  Length,
} from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty({ message: 'ID sinh viên không được để trống khi cập nhật' })
  id!: string;
}
