import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '@/common/models/base-response.output';
import { Lesson } from '@/lesson/schemas/lesson.schema';

@ObjectType()
export  class LessonMutationResponse extends BaseResponse(Lesson) {}