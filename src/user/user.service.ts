// src/modules/user/user.service.ts (hoặc đường dẫn tương ứng)

import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';

import {
  BaseCrudService,
  CrudResponse,
} from '@/common/services/base-crud.service';

@Injectable()
export class UserService extends BaseCrudService<UserDocument> {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @Inject('PUB_SUB') pubSub: PubSub,
  ) {
    super(userModel, pubSub, 'user');
  }

  async create(input: CreateUserInput): Promise<CrudResponse<UserDocument>> {
    try {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const dataToCreate = {
        ...input,
        password: hashedPassword,
      };
      return await super.create(dataToCreate);
    } catch (error: any) {
      if (error.code === 11000) {
        return {
          success: false,
          message: 'Mã sinh viên hoặc Email đã tồn tại',
          data: null,
        };
      }
      return {
        success: false,
        message: error.message || 'Không thể tạo sinh viên mới',
        data: null,
      };
    }
  }

  async update(input: UpdateUserInput): Promise<CrudResponse<UserDocument>> {
    try {
      const updateData = {
        id: input.id,
        ...(input.name && { name: input.name }),
      };

      return await super.update(updateData);
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Không thể cập nhật thông tin sinh viên',
        data: null,
      };
    }
  }

  async softDelete(id: string): Promise<CrudResponse<UserDocument>> {
    try {
      return await super.softDelete(id);
    } catch (error: any) {
      return {
        success: false,
        message: `Không thể xóa sinh viên với ID: ${id}`,
        data: null,
      };
    }
  }
  async findAll({ filters }: { filters: any }): Promise<UserDocument[]> {
    return this.userModel.find(filters);
  }
  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`Không tìm thấy sinh viên với ID: ${id}`);
    }

    return user;
  }
}
