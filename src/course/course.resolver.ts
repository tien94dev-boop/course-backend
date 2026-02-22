import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Course } from './schemas/course.schema';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { CourseFilterInput } from './dto/filter-course.input';
import { GqlAuthGuard } from '@/auth/gql-auth.guard';
import { Inject, UseGuards } from '@nestjs/common';
import type { GqlContext } from '@/common/gql-context';
import { CourseMutationResponse } from '@/course/models/course.models';
import { buildFilter } from '@/utils/buildFilter';

@Resolver(() => Course)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Course])
  courses(
    @Context() { req, res }: GqlContext,
    @Args('filter', { type: () => CourseFilterInput }) filter?: CourseFilterInput,
  ) {
    const userId = req.user.userId;
    const filters = buildFilter({ teacherId: userId });
    return this.courseService.findAll({filters});
  }

  @Query(() => Course)
  course(@Args('id', { type: () => ID }) id: string) {
    return this.courseService.findOne(id);
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => CourseMutationResponse)
  createCourse(
    @Args('input') input: CreateCourseInput,
    @Context() { req, res }: GqlContext,
  ) {
    const userId = req.user.userId;
    // teacherId
    return this.courseService.create({ ...input, teacherId: userId });
  }

  @Mutation(() => CourseMutationResponse)
  updateCourse(@Args('input') input: UpdateCourseInput) {
    return this.courseService.update(input);
  }

  @Mutation(() => CourseMutationResponse)
  deleteCourse(@Args('id', { type: () => ID }) id: string) {
    return this.courseService.remove(id);
  }
}
