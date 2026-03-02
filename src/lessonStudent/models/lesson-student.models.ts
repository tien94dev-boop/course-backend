import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '@/common/models/base-response.output';
import { LessonStudent } from '@/lessonStudent/schemas/lesson-student.schema';

@ObjectType()
export  class LessonStudentMutationResponse extends BaseResponse(LessonStudent) {}