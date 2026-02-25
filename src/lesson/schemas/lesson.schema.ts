import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { createBaseSchemaOptions } from '@/common/base-schema-options';
import { QuestionDetail, QuestionDetailSchema } from '@/ai/models/ai-generate.model';
import { LessonType } from '../enum/lesson.emun';
import { QuestionTypeObject } from '../models/questionTypeObject.model';

export type LessonDocument = HydratedDocument<Lesson>;
@ObjectType()
@Schema(createBaseSchemaOptions())
export class Lesson {
  @Field(() => ID)
  id!: Types.ObjectId;

  @Field(() => [QuestionDetail], { nullable: true })
  @Prop({ type: [QuestionDetailSchema], default: [] })
  questions?: QuestionDetail[];

  @Field({ nullable: true })
  @Prop({ required: true })
  title!: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  description?: string;


  @Field({ nullable: true })
  @Prop({ required: true })
  content?: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, required: true })
  chapterId!: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, required: true })
  teacherId!: Types.ObjectId;

  @Field(() => LessonType)
  @Prop({ required: true, enum: LessonType })
  type!: LessonType;

  @Field(() => [QuestionTypeObject], { nullable: true })
  @Prop({ required: false })
  questionTypeObjects?: QuestionTypeObject[];

  @Field({ nullable: true })
  @Prop({ required: false })
  link?: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
