import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { createBaseSchemaOptions } from '@/common/base-schema-options';
import { LessonType } from '../enum/lesson-student.emun';

@ObjectType()
@Schema(createBaseSchemaOptions({ timestamps: false }))
export class AnswerDetails {
_id!: Types.ObjectId;

  @Field(() => ID)
  id!: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, required: true })
  questionId!: Types.ObjectId;

  @Field(() => String)
  @Prop({ type: String, required: false })
  studentAnswer!: String;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  evaluate?: String;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, required: false })
  score?: Number;
}
export const AnswerDetailSchema = SchemaFactory.createForClass(AnswerDetails);

export type LessonStudentDocument = HydratedDocument<LessonStudent>;

@ObjectType()
@Schema(createBaseSchemaOptions())
export class LessonStudent {
_id!: Types.ObjectId;

  @Field(() => ID)
  id!: Types.ObjectId;

  @Field(() => [AnswerDetails], { nullable: true })
  @Prop({ type: [AnswerDetailSchema], default: [] })
  answers?: AnswerDetails[];

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, required: true })
  studentId!: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, required: true })
  lessonId!: Types.ObjectId;
}

export const LessonStudentSchema = SchemaFactory.createForClass(LessonStudent);
