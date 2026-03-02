import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseStudent, CourseStudentSchema } from './schemas/course-student.schema';
import { User, UserSchema } from "@/user/schemas/user.schema"
import { CourseStudentService } from './course-student.service';
import { CourseStudentResolver } from './course-student.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseStudent.name, schema: CourseStudentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [CourseStudentService, CourseStudentResolver],
})
export class CourseStudentModule {}
