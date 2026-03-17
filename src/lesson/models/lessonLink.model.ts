import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { createBaseSchemaOptions } from '@/common/base-schema-options';

export type LessonLinkDocument = HydratedDocument<LessonLink>;
@Schema({_id: true})
@ObjectType()
export class LessonLink {
  _id!: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  name!: string;

  @Field()
  @Prop({ required: true })
  link!: string;
}

export const LessonLinkSchema = SchemaFactory.createForClass(LessonLink);
