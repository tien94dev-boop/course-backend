import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Subscription,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { LessonStudent } from './schemas/lesson-student.schema';
import { LessonStudentService } from './lesson-student.service';
import { PubSub } from 'graphql-subscriptions';
import { Inject, UseGuards } from '@nestjs/common';
import { ChangedPayload } from '../common/dto/changed.payload';
import { CreateLessonStudentInput } from './dto/create-lesson-student.input';
import { UpdateLessonStudentInput } from './dto/update-lession-student.input';
import { LessonStudentMutationResponse } from './models/lesson-student.models';
import { GqlAuthGuard } from '@/auth/gql-auth.guard';
import type { GqlContext } from '@/common/gql-context';
import { FilterLessonStudentInput } from './dto/filter-lesson-student.input';
import { buildFilter } from '@/utils/buildFilter';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@/user/schemas/user.schema';
import { Lesson, LessonDocument } from '@/lesson/schemas/lesson.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AiService } from '@/ai/ai.service';

@Resolver(() => LessonStudent)
export class LessonStudentResolver {
  constructor(
    private readonly lessonStudentService: LessonStudentService,
    private readonly aiService: AiService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}
  @Subscription(() => ChangedPayload, { name: 'lessonStudentChanged' })
  lessonStudentChanged(
    @Args('operation', { type: () => String, nullable: true })
    operation?: string,
  ) {
    return this.pubSub.asyncIterableIterator('lessonChanged');
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => [LessonStudent], {
    name: 'allLessonStudents',
    description: 'Lấy danh sách toàn bộ bài học',
  })
  async allLessonStudents(
    @Context() { req, res }: GqlContext,
    @Args('filter', { type: () => FilterLessonStudentInput, nullable: true })
    filter?: FilterLessonStudentInput,
  ): Promise<LessonStudent[]> {
    const userId = req.user.userId;
    const filters = buildFilter({ ...filter, studentId: userId });
    const lessons = await this.lessonStudentService.findAll({ filters });
    return lessons;
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => LessonStudent, {
    name: 'getLessonStudent',
    description: 'Lấy thông tin chi tiết một bài học',
  })
  async getLessonStudent(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<LessonStudent | null> {
    return this.lessonStudentService.findOne({ _id: new ObjectId(id) });
  }
  @Mutation(() => LessonStudentMutationResponse, {
    description: 'Tạo mới một bài học vào hệ thống',
  })
  @UseGuards(GqlAuthGuard)
  async createLessonStudent(
    @Context() { req, res }: GqlContext,
    @Args('input') input: CreateLessonStudentInput,
  ): Promise<LessonStudentMutationResponse> {
    try {
      const userId = req.user.userId;
      const user = await this.userModel.findOne({ _id: new ObjectId(userId) });
      if (user?.role !== 'STUDENT') {
        return {
          success: false,
          message: 'Không phải là sinh viên!!!',
        };
      }
      const { lessonId } = input;
      const currentStudentAnswer = await this.lessonStudentService.findOne({
        studentId: new ObjectId(userId),
        lessonId: new ObjectId(lessonId),
      });
      console.log(33333, {...currentStudentAnswer})
      let result: any;
      if (currentStudentAnswer) {
        const { answers } = input;
        console.log({ currentStudentAnswer });
        result = await this.lessonStudentService.update({
          answers: answers,
          id: currentStudentAnswer._id,
        });
      } else {
        result = await this.lessonStudentService.create({
          ...input,
          studentId: userId,
        });
      }

      const currentLesson = await this.lessonModel.findOne({
        _id: new ObjectId(input.lessonId),
      });
      const rs = await this.aiService.assignmentGradingUsingAI({
        lessonStudent: result.data,
        lesson: currentLesson,
      });

      if (rs) {
        result = await this.lessonStudentService.updateAIResult({
          lessonStudent: result.data,
          lesson: currentLesson,
          resultsES: JSON.parse(rs),
        });
      }
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
  @Mutation(() => LessonStudentMutationResponse, {
    description: 'Cập nhật thông tin một bài học',
  })
  async updateLessonStudent(
    @Args('input') input: UpdateLessonStudentInput,
  ): Promise<LessonStudentMutationResponse> {
    try {
      const result = await this.lessonStudentService.update(input);
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
  @Mutation(() => LessonStudentMutationResponse)
  async deleteStudentLesson(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<LessonStudentMutationResponse> {
    try {
      const result = await this.lessonStudentService.softDelete(id);
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
