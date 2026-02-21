
import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';
import { Lesson, LessonDocument } from './schemas/lesson.schema';
import { BaseCrudService, CrudResponse } from '@/common/services/base-crud.service';
import { CreateLessonInput } from './dto/create-lesson.input';
import { generateLessonInput } from '@/utils/lesson'



@Injectable()
export class LessonService extends BaseCrudService<LessonDocument> {
    constructor(
        @InjectModel(Lesson.name)
        private readonly lessonModel: Model<LessonDocument>,
        @Inject('PUB_SUB') pubSub: PubSub,
    ) {
        super(lessonModel, pubSub, 'lesson');
    }
    async create(input: CreateLessonInput): Promise<CrudResponse<LessonDocument>> {
        try {
            const created = await super.create(input);
            return created;
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Không thể tạo bài học mới',
                data: null,
            };
        }
    }
    async update(input: any): Promise<CrudResponse<LessonDocument>> {
        try {
            const updated = await super.update(input);
            return updated;
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Không thể cập nhật bài học',
                data: null,
            };
    }
}
    async softDelete(id: string): Promise<CrudResponse<LessonDocument>> {
        try {
            return await super.softDelete(id);
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Không thể xóa bài học',
                data: null,
            };
        }
    }
    async findAll(): Promise<LessonDocument[]> {
        return this.lessonModel.find().exec();
    }
    async findOne(id: string): Promise<LessonDocument> {
        const lesson = await this.lessonModel.findById(id).exec();
        if (!lesson) {
            throw new NotFoundException(`Bài học với ID ${id} không tồn tại`);
        }
        return lesson;
    }
}