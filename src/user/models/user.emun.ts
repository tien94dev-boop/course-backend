import { Field, InputType, registerEnumType, Int, Float } from '@nestjs/graphql';

export enum UserRole {
    STUDENT = 'STUDENT',
    TEACHER = 'TEACHER',
    ADMIN = 'ADMIN',
  }

registerEnumType(UserRole, {
    name: 'UserRole',
});