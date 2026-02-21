import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Course } from './schemas/course.schema';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { CourseFilterInput } from './dto/filter-course.input';

@Resolver(() => Course)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Query(() => [Course])
  courses(
    @Args('filter', { type: () => CourseFilterInput })
    filter?: CourseFilterInput,
  ) {
    return this.courseService.findAll(filter);
  }

  @Query(() => Course)
  course(@Args('id', { type: () => ID }) id: string) {
    return this.courseService.findOne(id);
  }

  @Mutation(() => Course)
  createCourse(@Args('input') input: CreateCourseInput) {
    return this.courseService.create(input);
  }

  @Mutation(() => Course)
  updateCourse(@Args('input') input: UpdateCourseInput) {
    return this.courseService.update(input);
  }

  @Mutation(() => Course)
  deleteCourse(@Args('id', { type: () => ID }) id: string) {
    return this.courseService.remove(id);
  }
}
