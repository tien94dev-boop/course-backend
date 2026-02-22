import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory,  } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { createBaseSchemaOptions } from '@/common/base-schema-options';

export type CourseDocument = HydratedDocument<Course>;
@ObjectType()
@Schema(createBaseSchemaOptions())
export class Course {
  @Field(() => ID)
  id!: string;

  @Field()
  @Prop({ required: true })
  code!: string;

  @Field({ nullable: true })
  @Prop({ required: true })
  title!: string;

  @Field({ nullable: true })
  @Prop({ required: true })
  description?: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  teacherId!: Types.ObjectId;

  // @Field(() => ID, { nullable: true })
  // @Prop({ required: true })
  // classGroupId?: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
CourseSchema.index({code: 1}, {unique: true})