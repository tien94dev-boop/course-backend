import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { CourseStudentService } from './course-student.service';
import { CourseStudent } from './schemas/course-student.schema';
import { GqlAuthGuard } from '@/auth/gql-auth.guard';
import { Inject, UseGuards } from '@nestjs/common';
import type { GqlContext } from '@/common/gql-context';
import { buildFilter } from '@/utils/buildFilter';
import { CourseStudentMutationResponse } from './models/course-student.models';
import { RegisterCourseInput } from './dto/register-course.input copy';

@Resolver(() => CourseStudent)
export class CourseStudentResolver {
  constructor(private readonly courseStudentService: CourseStudentService) {}
  @UseGuards(GqlAuthGuard)
  @Mutation(() => CourseStudentMutationResponse)
  async registerCourse(
    @Args('input') input: RegisterCourseInput,
    @Context() { req, res }: GqlContext,
  ): Promise<CourseStudentMutationResponse> {
    const { courseId } = input;
    try {
      const userId = req.user.userId;
      return this.courseStudentService.registerCourse({
        studentId: userId,
        courseId,
      });
    } catch (err: any) {
      return {
        success: false,
        message: 'Đăng kí khoá học không thành công',
      };
    }
  }
}
