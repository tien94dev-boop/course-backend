import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterService } from './chapter.service';
import { ChapterResolver } from './chapter.resolver';
import { Chapter, ChapterSchema } from './schemas/chapter.schema';
import { User, UserSchema } from '@/user/schemas/user.schema';
import {
  CourseStudent,
  CourseStudentSchema,
} from '@/courseStudent/schemas/course-student.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chapter.name, schema: ChapterSchema },
      { name: User.name, schema: UserSchema },
      { name: CourseStudent.name, schema: CourseStudentSchema },
    ]),
  ],
  providers: [ChapterService, ChapterResolver],
  exports: [ChapterService],
})
export class ChapterModule {}
