
import { Types } from 'mongoose';
import { castObjectIdsInObject } from '@/common/utils/castObjectIds';
export function generateLessonInput(input: any) {
  console.log({ input, id: new Types.ObjectId()  });
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
  console.log({genQuestions})
  return { ...input, questions: genQuestions };
}
