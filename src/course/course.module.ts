import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/course.schema';
import { User, UserSchema } from "@/user/schemas/user.schema"
import { CourseService } from './course.service';
import { CourseResolver } from './course.resolver';
import { CourseStudent, CourseStudentSchema } from '@/courseStudent/schemas/course-student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: User.name, schema: UserSchema },
      { name: CourseStudent.name, schema: CourseStudentSchema },
    ]),
  ],
  providers: [CourseService, CourseResolver],
})
export class CourseModule {}
