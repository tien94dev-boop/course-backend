import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '@/common/models/base-response.output';
import { Course } from '@/course/schemas/course.schema';

@ObjectType()
export  class CourseMutationResponse extends BaseResponse(Course) {}