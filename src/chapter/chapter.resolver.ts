import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Subscription,
} from '@nestjs/graphql';
import { ChapterService } from './chapter.service';
import { Chapter } from './schemas/chapter.schema';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { ChangedPayload } from '@/common/dto/changed.payload';
import { CreateChapterInput } from './dto/create-chapter.input';
import { UpdateChapterInput } from './dto/update-chapter.input';
import { FilterChapterInput } from './dto/filter-chapter.input';
import { ChapterMutationResponse } from './models/chapter.models';

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

  @Query(() => [Chapter], {
    name: 'chapters',
    description: 'Lấy danh sách toàn bộ chương học',
  })
  async chapters(
    @Args('filter', { type: () => FilterChapterInput, nullable: true })
    filter?: FilterChapterInput,
  ): Promise<Chapter[]> {
    const chapters = await this.chapterService.findAll({ filter });
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

  @Mutation(() => ChapterMutationResponse, {
    description: 'Tạo mới một chương học vào hệ thống',
  })
  async createChapter(
    @Args('input') input: CreateChapterInput,
  ): Promise<ChapterMutationResponse> {
    const rs = await this.chapterService.create(input);
    return rs;
  }

  @Mutation(() => ChapterMutationResponse, { description: 'Cập nhật thông tin một chương học' })
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
