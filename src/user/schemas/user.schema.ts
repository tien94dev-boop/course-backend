import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { createBaseSchemaOptions } from '@/common/base-schema-options';
import { UserRole } from '../models/user.emun';

export type UserDocument = HydratedDocument<User>;
@ObjectType()
@Schema(createBaseSchemaOptions())
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  @Prop({ required: true })
  name!: string;

  @Field()
  @Prop({ required: true })
  code!: string;

  @Field()
  @Prop({ required: true })
  email!: string;

  @Field()
  @Prop({ required: true })
  dateOfBirth!: Date;

  @Field()
  @Prop({ default: null })
  role!: UserRole;

  @Prop({ required: true })
  password!: string;

  @Prop({ default: null })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ code: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
