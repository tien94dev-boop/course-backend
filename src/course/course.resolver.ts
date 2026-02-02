import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { CourseModel } from './models/course.model';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { CourseFilterInput } from './dto/course.filter';

@Resolver(() => CourseModel)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Query(() => [CourseModel])
  courses(
    @Args('filter', { type: () => CourseFilterInput })
    filter: CourseFilterInput,
  ) {
    return this.courseService.findAll(filter);
  }

  @Query(() => CourseModel)
  course(@Args('id', { type: () => ID }) id: string) {
    return this.courseService.findOne(id);
  }

  @Mutation(() => CourseModel)
  createCourse(@Args('input') input: CreateCourseInput) {
    return this.courseService.create(input);
  }

  @Mutation(() => CourseModel)
  updateCourse(@Args('input') input: UpdateCourseInput) {
    return this.courseService.update(input);
  }

  @Mutation(() => CourseModel)
  deleteCourse(@Args('id', { type: () => ID }) id: string) {
    return this.courseService.remove(id);
  }
}
