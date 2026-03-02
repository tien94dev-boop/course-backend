
import { registerEnumType } from '@nestjs/graphql';
export enum LessonStudentStatus {
    Submitted = 'Submitted',
    ExamGraded = 'ExamGraded',
  }

registerEnumType(LessonStudentStatus, {
    name: 'LessonStudentStatus',
});
