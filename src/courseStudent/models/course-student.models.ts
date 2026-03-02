import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '@/common/models/base-response.output';
import { CourseStudent } from '@/courseStudent/schemas/course-student.schema';

@ObjectType()
export  class CourseStudentMutationResponse extends BaseResponse(CourseStudent) {}