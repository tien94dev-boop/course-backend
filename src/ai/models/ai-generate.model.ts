import { Field, ObjectType, ID } from '@nestjs/graphql';
import { QuestionType } from '@/ai/dto/ai-generate.input';
import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { createBaseSchemaOptions } from '@/common/base-schema-options';

@Schema(createBaseSchemaOptions({timestamps: false}))
@ObjectType()
export class MCOption {
  @Field(() => ID)
  id?: Types.ObjectId;

  @Field({ nullable: true })
  @Prop({ required: true })
  choice?: string;

  @Field({ nullable: true })
  @Prop({ required: true })
  description?: string;
}


export const MCOptionSchema =
  SchemaFactory.createForClass(MCOption);


@Schema(createBaseSchemaOptions({timestamps: false}))
@ObjectType()
export class QuestionDetail {

  @Field(() => ID)
  id?: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  question!: string;

  @Field()
  @Prop({ required: true })
  answer!: string;

  @Field(() => [MCOption], { nullable: true })
  @Prop({ type: [MCOptionSchema], default: [] })
  mcOptions?: MCOption[];

  @Field(() => QuestionType)
  @Prop({ required: true, enum: QuestionType })
  questionType!: QuestionType;
}

export const QuestionDetailSchema =
  SchemaFactory.createForClass(QuestionDetail);


@ObjectType()
export class AiGenerateResponse {
  @Field(() => [QuestionDetail], { nullable: true })
  questions!: QuestionDetail[];
}
