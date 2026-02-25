import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { createBaseSchemaOptions } from '@/common/base-schema-options';
import {
  QuestionDetail,
  QuestionDetailSchema,
} from '@/ai/models/ai-generate.model';
import { QuestionType } from '@/ai/dto/ai-generate.input';

export type QuestionTypeObjectDocument = HydratedDocument<QuestionTypeObject>;
@Schema(createBaseSchemaOptions({timestamps: false}))
@ObjectType()
export class QuestionTypeObject {
  @Field(() => ID)
  id!: Types.ObjectId;

  @Field(() => QuestionType, { nullable: true })
  @Prop({ enum: QuestionType })
  type!: QuestionType;

  @Field({ nullable: true })
  @Prop({ required: true })
  numberOfQuestions!: number;
}

export const QuestionTypeObjectSchema = SchemaFactory.createForClass(QuestionTypeObject);
