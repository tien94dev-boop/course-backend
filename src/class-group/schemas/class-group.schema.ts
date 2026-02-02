import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@Schema()
@ObjectType()
export class ClassGroup {
  @Field(() => ID)
  _id: string;

  @Field(() => Int)
  @Prop({ required: true })
  grade: number; // 12

  @Field()
  @Prop({ required: true })
  name: string; // A2

  @Field({ nullable: true })
  @Prop()
  schoolYear?: string;
}

export const ClassGroupSchema = SchemaFactory.createForClass(ClassGroup);
