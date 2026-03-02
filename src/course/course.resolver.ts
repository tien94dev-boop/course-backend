import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
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
import {
  CourseStudent,
  CourseStudentDocument,
} from '@/courseStudent/schemas/course-student.schema';
import { User } from '@/user/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '@/user/schemas/user.schema';
import { UserRole } from '@/user/models/user.emun';

@Resolver(() => Course)
export class CourseResolver {
  constructor(
    private readonly courseService: CourseService,
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('CourseStudent')
    private courseStudentModel: Model<CourseStudentDocument>,
  ) {}
  @ResolveField(() => [User])
  async students(@Parent() course: Course) {
    const records = await this.courseStudentModel
      .find({ courseId: course.id })
      .populate('studentId');

    return records.map((r) => r.studentId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Course])
  async courses(
    @Context() { req, res }: GqlContext,
    @Args('filter', { type: () => CourseFilterInput })
    filter?: CourseFilterInput,
  ) {
    let filters = {} as any;
    const userId = req.user.userId;
    const user = await this.userModel.findOne({ _id: userId, deletedAt: null });
    if (user && user.role === ('TEACHER' as UserRole)) {
      filters.teacherId = userId;
    }
  
    const buildfilters = buildFilter(filters);
    return this.courseService.findAll({ filters: buildfilters });
  }

  @Query(() => [User])
  async studentsByCourse(
    @Args('courseId', { type: () => ID }) courseId: string,
  ) {
    const relations = await this.courseStudentModel
      .find({ courseId })
      .select('studentId');

    const studentIds = relations.map((r) => r.studentId);

    return this.userModel.find({
      _id: { $in: studentIds },
      role: 'STUDENT',
    });
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
