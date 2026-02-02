import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  code: string;

  @Prop()
  description?: string;

  @Prop()
  price?: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.index({ code: 1 }, { unique: true });
