import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';
import {
  AnswerDetails,
  LessonStudent,
  // LessonStudent,
} from './schemas/lesson-student.schema';
import {
  BaseCrudService,
  CrudResponse,
} from '@/common/services/base-crud.service';
import { CreateLessonStudentInput } from './dto/create-lesson-student.input';
import { generateLessonInput } from '@/utils/lesson';
import { Lesson } from '@/lesson/schemas/lesson.schema';
import _ from 'lodash';
import { QuestionDetail } from '@/ai/models/ai-generate.model';

@Injectable()
export class LessonStudentService extends BaseCrudService<LessonStudent> {
  constructor(
    @InjectModel(LessonStudent.name)
    private readonly lessonStudentModel: Model<LessonStudent>,
    @Inject('PUB_SUB') pubSub: PubSub,
  ) {
    super(lessonStudentModel, pubSub, 'lesson');
  }
  async create(input: any): Promise<CrudResponse<LessonStudent>> {
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
  async update(input: any): Promise<CrudResponse<LessonStudent>> {
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
  async softDelete(id: string): Promise<CrudResponse<LessonStudent>> {
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
  async findAll({
    filters,
  }: {
    filters: any;
  }): Promise<LessonStudent[]> {
    return this.lessonStudentModel.find(filters);
  }
  async findOne(filter: any): Promise<LessonStudent | null> {
    const lessonStudent = await this.lessonStudentModel.findOne(filter).exec();
    if (!lessonStudent) {
      return null;
    }
    return lessonStudent;
  }
  async updateAIResult({
    lessonStudent,
    lesson,
    resultsES,
  }: {
    lessonStudent: LessonStudent | null;
    lesson: Lesson | null;
    resultsES: any;
  }) {
    const answers = _.get(lessonStudent, 'answers', []);
    const questions = _.get(lesson, 'questions', []);
    console.log(resultsES, questions)
    const esResultMap = _.keyBy(resultsES, (es: any) => es.id.toString());
    const questionMap = _.keyBy(questions, (q: any) => q._id?.toString());
    const answersWithResult = answers.map((answer: AnswerDetails) => {
      const qId = answer.questionId.toString();
      const question = questionMap[qId];

      if (!question) {
        return { ...answer, score: 0, evaluate: 'Không tìm thấy câu hỏi' };
      }

      const { questionType } = question;

      if (questionType === 'MC') {
        const teacherAnswer = _.get(question, 'answer', '');
        const studentAnswer = _.get(answer, 'studentAnswer', '');
        const isCorrect = teacherAnswer === studentAnswer;
        return {
          ...answer,
          score: isCorrect ? 100 : 0,
          evaluate: isCorrect ? 'Chính xác' : 'Chưa chính xác',
        };
      }

      if (questionType === 'ES') {
        const aiRes = esResultMap[qId];
        return {
          ...answer,
          score: _.get(aiRes, 'score', 0),
          evaluate: _.get(aiRes, 'evaluate', 'Đáp án chưa được ghi nhận'),
        };
      }

      return { ...answer, score: 0, evaluate: 'Loại câu hỏi không xác định' };
    });
    console.log(22222, {
      ...lessonStudent,
      answers: answersWithResult,
    })
    return await super.update({
      ...lessonStudent,
      answers: answersWithResult,
    });
  }
}
