
import { Types } from 'mongoose';
import { castObjectIdsInObject } from '@/common/utils/castObjectIds';
import { LessonStudent } from '@/lessonStudent/schemas/lesson-student.schema'
import { Lesson } from '@/lesson/schemas/lesson.schema'
export function generateLessonInput(input: any) {
  const { questions, chapterId } = input;
  const genQuestions = questions.map((question: any) => {
    const { mcOptions, questionType } = question;
    if (questionType === 'ES') return { ...question, id: new Types.ObjectId() };
    const genMCOptions = mcOptions.map((option: any) => {
      return {
        ...option,
        id: new Types.ObjectId(),
      };
    });
    return {
      ...question,
      id: new Types.ObjectId(),
      mcOptions: genMCOptions,
    };
  });
  return { ...input, questions: genQuestions };
}
