import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory,  } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { createBaseSchemaOptions } from '@/common/base-schema-options';
import { User } from "@/user/schemas/user.schema"

export type CourseStudentDocument = HydratedDocument<CourseStudent>;
@ObjectType()
@Schema(createBaseSchemaOptions())
export class CourseStudent {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId!: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId!: Types.ObjectId;

  @Field(() => [User], { nullable: true })
  students?: User[];

}

export const CourseStudentSchema = SchemaFactory.createForClass(CourseStudent);
CourseStudentSchema.index(
  { studentId: 1, courseId: 1 },
  { unique: true }
);