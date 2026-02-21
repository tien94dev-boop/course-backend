import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsUppercase,
  Length,
} from 'class-validator';
import { UserRole } from '../models/user.emun';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString({ message: 'Tên sinh viên phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên sinh viên không được để trống' })
  readonly name!: string;

  @Field(() => String)
  @IsString({ message: 'Mã sinh viên phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mã sinh viên không được để trống' })
  @IsUppercase({ message: 'Mã sinh viên phải viết hoa' })
  @Length(3, 10, { message: 'Mã sinh viên phải từ 3 đến 10 ký tự' })
  readonly code!: string;

  @Field(() => String)
  @IsEmail({}, { message: 'Định dạng email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  readonly email!: string;

  @Field()
  password!: string;

  @Field(() => String)
  @IsDateString({}, { message: 'Ngày sinh phải là định dạng ngày (ISO 8601)' })
  @IsNotEmpty({ message: 'Ngày sinh không được để trống' })
  readonly dateOfBirth!: string;

  @Field(()=>UserRole)
  readonly role!: UserRole
}
