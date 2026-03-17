
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonService } from './lesson.service';
import { LessonResolver, LessonLinkResolver } from './lesson.resolver';
import { Lesson, LessonSchema,  } from './schemas/lesson.schema';
import {QuestionDetailResolver} from "./question-detail.resolver"
import { User, UserSchema } from "@/user/schemas/user.schema"
import { LessonStudent, LessonStudentSchema } from '@/lessonStudent/schemas/lesson-student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
      { name: User.name, schema: UserSchema },
      { name: LessonStudent.name, schema: LessonStudentSchema }
    ]),
  ],
  providers: [
    LessonService, 
    LessonResolver,
    QuestionDetailResolver,
    LessonLinkResolver,
  ],
  exports: [
    LessonService
  ],
})
export class LessonModule {}    