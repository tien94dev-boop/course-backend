
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonStudentService } from './lesson-student.service';
import { LessonStudentResolver, AnswerDetailsResolver } from './lesson-student.resolver';
import { LessonStudent, LessonStudentSchema,  } from './schemas/lesson-student.schema';
import { User, UserSchema } from "@/user/schemas/user.schema"
import { AiService } from '@/ai/ai.service';
import { Lesson, LessonSchema } from '@/lesson/schemas/lesson.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LessonStudent.name, schema: LessonStudentSchema },
      { name: User.name, schema: UserSchema },
      { name: Lesson.name, schema: LessonSchema },
    ]),
  ],
  providers: [
    LessonStudentService, 
    LessonStudentResolver,
    AiService, 
    AnswerDetailsResolver,
  ],
  exports: [
    LessonStudentService
  ],
})
export class LessonStudentModule {}    