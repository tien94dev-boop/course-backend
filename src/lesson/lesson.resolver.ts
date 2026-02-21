import { Resolver, Query, Mutation, Args, ID, Subscription } from '@nestjs/graphql';
import { Lesson } from "./schemas/lesson.schema";
import { LessonService } from "./lesson.service";
import { PubSub } from "graphql-subscriptions";
import { Inject } from '@nestjs/common';
import { ChangedPayload } from '../common/dto/changed.payload';
import { CreateLessonInput } from './dto/create-lesson.input';
import { UpdateLessonInput } from './dto/update-lession.input';
import { LessonMutationResponse } from './models/lesson.models';

@Resolver(() => Lesson)
export class LessonResolver {
  constructor(
    private readonly lessonService: LessonService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
) {}
  @Subscription(() => ChangedPayload, { name: 'lessonChanged' })
  lessonChanged(
    @Args('operation', { type: () => String, nullable: true }) operation?: string,
  ) {
    return this.pubSub.asyncIterableIterator('lessonChanged');
  }
  @Query(() => [Lesson], { name: 'allLessons', description: 'Lấy danh sách toàn bộ bài học' })
  async allLessons(): Promise<Lesson[]> {
    const lessons = await this.lessonService.findAll();
    return lessons;
  }
  @Query(() => Lesson, { name: 'getLesson', description: 'Lấy thông tin chi tiết một bài học' })
  async getLesson(@Args('id', { type: () => ID }) id: string): Promise<Lesson> {
    return this.lessonService.findOne(id);
  }
  @Mutation(() => LessonMutationResponse, { description: 'Tạo mới một bài học vào hệ thống' })
  async createLesson(
    @Args('input') input: CreateLessonInput,
  ): Promise<LessonMutationResponse> {
    try {
      const result = await this.lessonService.create(input);
      console.log({result});
      return result;
    } catch (error) {
      return {
        success: false, 
        message: error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi tạo bài học',
        data: null,
      }
    }
  }
  @Mutation(() => LessonMutationResponse, { description: 'Cập nhật thông tin một bài học' })
  async updateLesson(
    @Args('input') input: UpdateLessonInput,
  ): Promise<LessonMutationResponse> {
    try {
      const result = await this.lessonService.update(input);
      return result;
    } catch (error) {
        return {
        success: false,
        message: error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi tạo sinh viên',
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
       throw new Error(error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi xóa bài học');
     }
   }
}