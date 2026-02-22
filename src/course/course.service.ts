import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { CourseFilterInput } from './dto/filter-course.input';
import {
  BaseCrudService,
  CrudResponse,
} from '@/common/services/base-crud.service';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class CourseService extends BaseCrudService<CourseDocument> {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
    @Inject('PUB_SUB') pubSub: PubSub,
  ) {
    super(courseModel, pubSub, 'lesson');
  }

  async create(
    input: CreateCourseInput,
  ): Promise<CrudResponse<CourseDocument>> {
    const errors: { field: string; message: string }[] = [];
    let args = { ...input, code: new Date().getTime().toString() };
    const existed = await this.courseModel.findOne({ code: args.code });
    if (existed) {
      return {
        success: false,
        message: 'Code khoá học đã tồn tại',
        data: null,
      };
    }

    if (errors.length > 0) {
      return {
        success: false,
        message: 'Có lỗi không xác định!!!',
        data: null,
      };
    }
    try {
      return await super.create(input);
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Không thể tạo bài học mới',
        data: null,
      };
    }
  }

  async findAll({ filters }: { filters?: any }) {
    // const query: any = {};

    // if (filter?.name) {
    //   query.name = { $regex: filter.name, $options: 'i' };
    // }

    // if (filter?.description) {
    //   query.description = {
    //     $regex: filter.description,
    //     $options: 'i',
    //   };
    // }
    return this.courseModel.find(filters);
  }

  async findOne(id: string) {
    return this.courseModel.findById(id);
  }

  async update(
    input: UpdateCourseInput,
  ): Promise<CrudResponse<CourseDocument>> {
    const { id, code, ...updateData } = input;

    const course = await this.courseModel.findById(id);
    if (!course) {
      throw new BadRequestException('Course không tồn tại');
    }

    if (code) {
      const existed = await this.courseModel.findOne({
        code,
        id: { $ne: id },
      });

      if (existed) {
        return {
          success: false,
          message: 'Course Exist!!!',
          data: null,
        };
      }
    }

    // 3. Update + chốt DB
    try {
      return await super.update(input);
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Update Fail!!!',
        data: null,
      };
    }
  }

  async remove(id: string) {
    return this.courseModel.findByIdAndDelete(id);
  }
}
