import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Chapter, ChapterDocument } from './schemas/chapter.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PubSub } from 'graphql-subscriptions';
import { BaseCrudService, CrudResponse } from '@/common/services/base-crud.service';
import { FilterChapterInput } from './dto/filter-chapter.input';
import { CreateChapterInput } from './dto/create-chapter.input';
import { UpdateChapterInput } from './dto/update-chapter.input';
import { ChapterMutationResponse } from './models/chapter.models';
import { buildFilter } from '@/utils/buildFilter';
@Injectable()
export class ChapterService extends BaseCrudService<ChapterDocument> {
  constructor(
    @InjectModel(Chapter.name)
    private chapterModel: Model<ChapterDocument>,
    @Inject('PUB_SUB') pubSub: PubSub,
  ) {
    super(chapterModel, pubSub, 'chapter');
  }
  async findAll({ filters }:{filters: any}) {
    console.log({filters})
    return this.chapterModel.find(filters);
  }
  async findOne(id: string) {
    return this.chapterModel.findById(id);
  }
async create(input: any): Promise<CrudResponse<ChapterDocument>> {
  try {
    if (!input.title) {
      return {
        success: false,
        message: 'Title là bắt buộc',
        data: null,
      };
    }

    const values = {
      ...input,
      order: 1,
    };

    const rs = await super.create(values);
    return rs;

  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Không thể tạo chapter',
      data: null,
    };
  }
}
   async update(input: UpdateChapterInput): Promise<CrudResponse<ChapterDocument>> {
    try {
      return await super.update(input);
    } catch (error) {
      throw new BadRequestException('Không thể cập nhật chương học');
    }
   }
   async softDelete(id: string) {
    try {
      return await super.softDelete(id);
    } catch (error) {
      throw new BadRequestException('Không thể xóa chương học');
    }
   }
}
