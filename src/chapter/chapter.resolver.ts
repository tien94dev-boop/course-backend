import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Subscription,
  Context,
} from '@nestjs/graphql';
import { ChapterService } from './chapter.service';
import { Chapter } from './schemas/chapter.schema';
import { Inject, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { ChangedPayload } from '@/common/dto/changed.payload';
import { CreateChapterInput } from './dto/create-chapter.input';
import { UpdateChapterInput } from './dto/update-chapter.input';
import { FilterChapterInput } from './dto/filter-chapter.input';
import { ChapterMutationResponse } from './models/chapter.models';
import { GqlAuthGuard } from '@/auth/gql-auth.guard';
import type { GqlContext } from '@/common/gql-context';
import { buildFilter } from '@/utils/buildFilter';

@Resolver()
export class ChapterResolver {
  constructor(
    private readonly chapterService: ChapterService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}
  @Subscription(() => ChangedPayload, { name: 'chapterChanged' })
  chapterChanged(
    @Args('operation', { type: () => String, nullable: true })
    operation?: string,
  ) {
    return this.pubSub.asyncIterableIterator('chapterChanged');
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => [Chapter], {
    name: 'chapters',
    description: 'Lấy danh sách toàn bộ chương học',
  })
  async chapters(
    @Context() { req, res }: GqlContext,
    @Args('filter', { type: () => FilterChapterInput, nullable: true })
    filter?: FilterChapterInput,
  ): Promise<Chapter[]> {
    const userId = req.user.userId;
    const filters = buildFilter({ ...filter, teacherId: userId });
    const chapters = await this.chapterService.findAll({ filters });
    return chapters;
  }

  @Query(() => Chapter, {
    name: 'chapter',
    description: 'Lấy thông tin chi tiết một chương học',
  })
  async chapter(@Args('id', { type: () => ID }) id: string): Promise<Chapter> {
    const chapter = await this.chapterService.findOne(id);
    if (!chapter) {
      throw new Error('Chapter not found');
    }
    return chapter;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ChapterMutationResponse, {
    description: 'Tạo mới một chương học vào hệ thống',
  })
  async createChapter(
    @Context() { req, res }: GqlContext,
    @Args('input') input: CreateChapterInput,
  ): Promise<ChapterMutationResponse> {
    const userId = req.user.userId;
    const rs = await this.chapterService.create({
      ...input,
      teacherId: userId,
    });
    return rs;
  }

  @Mutation(() => ChapterMutationResponse, {
    description: 'Cập nhật thông tin một chương học',
  })
  async updateChapter(
    @Args('input') input: UpdateChapterInput,
  ): Promise<ChapterMutationResponse> {
    return this.chapterService.update(input);
  }

  @Mutation(() => ChapterMutationResponse, {
    description: 'Xóa mềm một chương học khỏi hệ thống',
  })
  async deleteChapter(@Args('id', { type: () => ID }) id: string) {
    return this.chapterService.softDelete(id);
  }
}
