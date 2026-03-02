import { Injectable, BadRequestException, Inject, UseGuards } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CourseStudent,
  CourseStudentDocument,
} from './schemas/course-student.schema';
import { User, UserDocument } from '@/user/schemas/user.schema';
import {
  BaseCrudService,
  CrudResponse,
} from '@/common/services/base-crud.service';
import { PubSub } from 'graphql-subscriptions';
import { ObjectId } from "mongodb"
import { GqlAuthGuard } from '@/auth/gql-auth.guard';
import {
  Context,
} from '@nestjs/graphql';
import { UserRole } from '@/user/models/user.emun';

@Injectable()
export class CourseStudentService extends BaseCrudService<CourseStudentDocument> {
  constructor(
    @InjectModel(CourseStudent.name)
    private courseStudentModel: Model<CourseStudentDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @Inject('PUB_SUB') pubSub: PubSub,
  ) {
    super(courseStudentModel, pubSub, 'lesson');
  }

  @UseGuards(GqlAuthGuard)
  async registerCourse({
    studentId,
    courseId,
    role
  }: {
    studentId: string;
    courseId: string;
    role: UserRole
  }): Promise<CrudResponse<CourseStudentDocument>> {
    const existed = await this.courseStudentModel.findOne({
      studentId: new ObjectId(studentId),
      courseId: new ObjectId(courseId),
    });
    if (role === 'TEACHER') {
      return {
        success: false,
        message: 'Giáo viên không cần phải đăng kí',
        data: null,
      };
    }
    if (existed) {
      return {
        success: false,
        message: 'Đã đăng kí từ trước!!!!',
        data: null,
      };
    }

    try {
      await this.courseStudentModel.create({
        studentId: new ObjectId(studentId),
        courseId: new ObjectId(courseId),
      });
      return {
        success: true,
        message: 'Đăng kí thành công!!!!',
        data: null,
      };
    } catch (err: any) {
      return {
        success: true,
        message: 'Có lỗi không xác định!!!!',
        data: null,
      };
    }
  }
}
