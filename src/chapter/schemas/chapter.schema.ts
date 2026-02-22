import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { createBaseSchemaOptions } from '@/common/base-schema-options';

export type ChapterDocument = HydratedDocument<Chapter>;
@ObjectType()
@Schema(createBaseSchemaOptions())
export class Chapter {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  @Prop({ required: true })
  title!: string;

  @Field({ nullable: true })
  @Prop({ required: true })
  description?: string;

  @Field(() => ID)
  @Prop({ required: true })
  courseId!: Types.ObjectId;

  @Field(() => ID)
  @Prop({ required: true })
  teacherId!: Types.ObjectId;

  @Field(() => Int, { nullable: true })
  @Prop({ required: true })
  order?: number;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
