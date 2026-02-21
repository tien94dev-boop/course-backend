import { Injectable, BadRequestException } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './schemas/course.schema';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { CourseFilterInput } from './dto/filter-course.input';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<Course>,
  ) {}

  async create(input: CreateCourseInput) {
    // Check logic nghiệp vụ (UX)
    const errors: { field: string; message: string }[] = [];
    const existed = await this.courseModel.findOne({ code: input.code });
    if (existed) {
      errors.push({
        field: 'code',
        message: 'Course code đã tồn tại',
      });
    }

    if (errors.length > 0) {
      throw new GraphQLError('Validation failed', {
        extensions: {
          validationErrors: errors,
        },
      });
    }
    try {
      return await this.courseModel.create(input);
    } catch (error) {
      // Chốt chặn cuối cùng ở DB
      if ((error as any).code === 11000) {
        throw new BadRequestException(`Course code "${input.code}" đã tồn tại`);
      }
      throw error;
    }
  }

  async findAll(filter?: CourseFilterInput) {
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
    return this.courseModel.find();
  }

  async findOne(id: string) {
    return this.courseModel.findById(id);
  }

  async update(input: UpdateCourseInput) {
    const { id, code, ...updateData } = input;

    // 1. Check tồn tại course
    const course = await this.courseModel.findById(id);
    if (!course) {
      throw new BadRequestException('Course không tồn tại');
    }

    // 2. Check trùng code (UX)
    if (code) {
      const existed = await this.courseModel.findOne({
        code,
        id: { $ne: id }, // ❗ loại trừ chính nó
      });

      if (existed) {
        throw new BadRequestException(`Course code "${code}" đã tồn tại`);
      }
    }

    // 3. Update + chốt DB
    try {
      return await this.courseModel.findByIdAndUpdate(
        id,
        { code, ...updateData },
        { new: true },
      );
    } catch (error) {
      if ((error as any).code === 11000) {
        throw new BadRequestException(`Course code "${code}" đã tồn tại`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    return this.courseModel.findByIdAndDelete(id);
  }
}
