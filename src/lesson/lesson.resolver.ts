import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Subscription,
  Context,
} from '@nestjs/graphql';
import { Lesson } from './schemas/lesson.schema';
import { LessonService } from './lesson.service';
import { PubSub } from 'graphql-subscriptions';
import { Inject, UseGuards } from '@nestjs/common';
import { ChangedPayload } from '../common/dto/changed.payload';
import { CreateLessonInput } from './dto/create-lesson.input';
import { UpdateLessonInput } from './dto/update-lession.input';
import { LessonMutationResponse } from './models/lesson.models';
import { GqlAuthGuard } from '@/auth/gql-auth.guard';
import type { GqlContext } from '@/common/gql-context';
import { FilterLessonInput } from './dto/filter-lesson.input';
import { buildFilter } from '@/utils/buildFilter';

@Resolver(() => Lesson)
export class LessonResolver {
  constructor(
    private readonly lessonService: LessonService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}
  @Subscription(() => ChangedPayload, { name: 'lessonChanged' })
  lessonChanged(
    @Args('operation', { type: () => String, nullable: true })
    operation?: string,
  ) {
    return this.pubSub.asyncIterableIterator('lessonChanged');
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => [Lesson], {
    name: 'allLessons',
    description: 'Lấy danh sách toàn bộ bài học',
  })
  async allLessons(
    @Context() { req, res }: GqlContext,
    @Args('filter', { type: () => FilterLessonInput, nullable: true })
    filter?: FilterLessonInput,
  ): Promise<Lesson[]> {
    const userId = req.user.userId;
    const filters = buildFilter({ ...filter, teacherId: userId });
    const lessons = await this.lessonService.findAll({filters});
    return lessons;
  }
  @Query(() => Lesson, {
    name: 'getLesson',
    description: 'Lấy thông tin chi tiết một bài học',
  })
  async getLesson(@Args('id', { type: () => ID }) id: string): Promise<Lesson> {
    return this.lessonService.findOne(id);
  }
  @Mutation(() => LessonMutationResponse, {
    description: 'Tạo mới một bài học vào hệ thống',
  })

  @UseGuards(GqlAuthGuard)
  async createLesson(
      @Context() { req, res }: GqlContext,
    @Args('input') input: CreateLessonInput,
  ): Promise<LessonMutationResponse> {
    try {
        const userId = req.user.userId;
      const result = await this.lessonService.create({...input, teacherId: userId});
      console.log({ result });
      return result;
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Đã có lỗi xảy ra khi tạo bài học',
        data: null,
      };
    }
  }
  @Mutation(() => LessonMutationResponse, {
    description: 'Cập nhật thông tin một bài học',
  })
  async updateLesson(
    @Args('input') input: UpdateLessonInput,
  ): Promise<LessonMutationResponse> {
    try {
      const result = await this.lessonService.update(input);
      return result;
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Đã có lỗi xảy ra khi tạo sinh viên',
        data: null,
      };
    }
  }
  @Mutation(() => LessonMutationResponse)
  async deleteLesson(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<LessonMutationResponse> {
    try {
      const result = await this.lessonService.softDelete(id);
      return result;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Đã có lỗi xảy ra khi xóa bài học',
      );
    }
  }
}
