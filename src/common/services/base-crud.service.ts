// src/common/services/base-crud.service.ts

import { Injectable, Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { Model, HydratedDocument,  } from 'mongoose';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { castObjectIdsInObject } from '@/common/utils/castObjectIds';
export interface CrudResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

@Injectable()
export abstract class BaseCrudService<T extends HydratedDocument<any>> {
  constructor(
    protected readonly model: Model<T>,
    @Inject('PUB_SUB') protected readonly pubSub: PubSub,
    protected readonly entityName: string,
  ) {}

  private getChangedTrigger(): string {
    return `${this.entityName}Changed`;
  }

  async create(input: any): Promise<CrudResponse<T>> {
    try {
      const castInput = castObjectIdsInObject(input);
      const doc = new this.model(castInput);
      const saved = await doc.save();
      const trigger = this.getChangedTrigger();
      this.pubSub.publish(trigger, {
        [`${this.entityName}Changed`]: {
          operation: 'CREATE',
          data: saved as T,
        },
      });

      return {
        success: true,
        message: `${this.entityName} đã được tạo thành công`,
        data: saved as T,
      };
    } catch (error: any) {
      if (error.code === 11000) {
        return {
          success: false,
          message: `${this.entityName} đã tồn tại (duplicate key)`,
          data: null,
        };
      }
      return {
        success: false,
        message: error.message || `Không thể tạo ${this.entityName}`,
        data: null,
      };
    }
  }

  async update(input: any): Promise<CrudResponse<T>> {
    try {
      const { id, ...rest } = input;

      if (!id) {
        return {
          success: false,
          message: 'ID là bắt buộc để cập nhật',
          data: null,
        };
      }

      const castRest = castObjectIdsInObject(rest);
      const updated = await this.model
        .findByIdAndUpdate(id, castRest, { new: true, runValidators: true })
        .exec();

      if (!updated) {
        return {
          success: false,
          message: `${this.entityName} không tìm thấy`,
          data: null,
        };
      }

      const trigger = this.getChangedTrigger();
      this.pubSub.publish(trigger, {
        [`${this.entityName}Changed`]: {
          operation: 'UPDATE',
          data: updated as T,
        },
      });

      return {
        success: true,
        message: `${this.entityName} đã được cập nhật thành công`,
        data: updated as T,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || `Không thể cập nhật ${this.entityName}`,
        data: null,
      };
    }
  }

  async softDelete(id: string): Promise<CrudResponse<T>> {
    try {
      if (!id) {
        return {
          success: false,
          message: 'ID là bắt buộc để xóa',
          data: null,
        };
      }

      const updated = await this.model
        .findByIdAndUpdate(
          id,
          { deletedAt: new Date() },
          { new: true, runValidators: true },
        )
        .exec();

      if (!updated) {
        return {
          success: false,
          message: `${this.entityName} không tìm thấy`,
          data: null,
        };
      }

      const trigger = this.getChangedTrigger();
      this.pubSub.publish(trigger, {
        [`${this.entityName}Changed`]: {
          operation: 'DELETE', // hoặc 'SOFT_DELETE' nếu bạn muốn phân biệt
          data: updated as T,
        },
      });

      return {
        success: true,
        message: `${this.entityName} đã được xóa mềm thành công`,
        data: updated as T,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || `Không thể xóa ${this.entityName}`,
        data: null,
      };
    }
  }
}