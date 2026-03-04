import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AiGenerateInput } from '@/ai/dto/ai-generate.input';
import {
  AnswerDetails,
  LessonStudent,
} from '@/lessonStudent/schemas/lesson-student.schema';
import { Lesson } from '@/lesson/schemas/lesson.schema';
import { QuestionDetail } from './models/ai-generate.model';
import * as cheerio from 'cheerio';

function stripHtmlToText(html: string): string {
  const $ = cheerio.load(html);
  return $('body').text().trim(); // Hoặc chỉ $('*').text() nếu không wrap body
}

@Injectable()
export class AiService {
  // Khởi tạo SDK với API Key từ môi trường
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  async generateRawText({
    content,
    language = 'vi',
    questionTypes,
  }: AiGenerateInput) {
    let questionString: string[] = [];
    for (const qt of questionTypes) {
      const { type, numberOfQuestions } = qt;
      if (numberOfQuestions > 0) {
        const reqString = `${numberOfQuestions} câu ${type === 'ES' ? 'Tự luận' : 'Trắc nghiệm'}`;
        questionString.push(reqString);
      }
    }
    const MCForm = `{
            "question": "...",
            mcOption: là một mảng dạng {choice: A|B|C|D, description: nội dung các đáp án}, và nhớ chỉ có duy nhất 1 đáp án đúng
            "answer": 1 trong 4 đáp án A, B, C, D,
            "questionType:  luôn là MC
        }
        `;

    const ESForm = `{
            "question": "...",
            "answer": Là chuỗi đáp án đầy đủ ngắn gọn nhất phụ thuộc vào nội dung được cung cấp,
            "questionType:  luôn là ES
        }`;

    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const prompt = `
        Phân tích nội dung sau:

        DỮ LIỆU GỐC:
        """
        ${content}
        """
        NGÔN NGỮ
        ${language}

        YÊU CẦU VỀ SỐ LƯỢNG CÂU HỎI
        ${questionString.join(',')}

        YÊU CẦU KẾT QUẢ TRẢ VỀ
        nếu là tự luận ${ESForm}
        nếu là trắc nghiệm ${MCForm}

        YÊU CẦU BẮT BUỘC:
        1. Trả về định dạng JSON thuần túy.
        2. Không sử dụng khối mã Markdown (không có \`\`\`json).
        3. Không giải thích, không dông dài, chỉ cần câu trả lời chính xác.
        4. Các câu không được cùng 1 đáp án: ví dụ toàn là đáp án A 
        `;

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });
      console.log({ 1111: result.response.text() });
      return result.response.text();
    } catch (error) {
      console.error('Lỗi khi gọi Gemini 2.5:', error);
      throw new Error('Không thể kết nối với AI Model 2.5');
    }
  }
  async assignmentGradingUsingAI({
    lessonStudent,
    lesson,
  }: {
    lessonStudent: LessonStudent | null;
    lesson: Lesson | null;
  }) {
    if (!lessonStudent || !lesson) {
      return;
    }
    const { answers } = lessonStudent;
    const { questions } = lesson;
    const ESQuestions = (questions || []).filter(
      (question: QuestionDetail) => question.questionType === 'ES',
    );
    const promtESQuestions = ESQuestions.map((question: QuestionDetail) => {
      const studentAnswerObject = answers?.find((answer: AnswerDetails) => {
        return answer.questionId.toString() === question._id?.toString();
      });
      if (studentAnswerObject) {
        return {
          id: question._id,
          studentAnswer: stripHtmlToText(
            studentAnswerObject.studentAnswer.toString(),
          ),
          answer: stripHtmlToText(question.answer),
        };
      } else {
        return {
          id: question._id,
          answer: stripHtmlToText(question.answer),
        };
      }
    });
    //     return `[
    // {
    //   "id": "69a1b7079409a3a0b841ebb2",
    //   "score": 20,
    //   "evaluate": "Câu trả lời chưa làm rõ bản chất và định nghĩa của vấn đề."
    // }
    //     ]`
    if (promtESQuestions.length <= 0) return null;
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });
    try {
      const prompt = `
        Tôi có 1 array là các object dạng như sau
        {
        id: (đây là ID của câu hỏi dưới dạng string),
        answer: (Đây là đáp án của giáo viên, có dạng chuỗi),
        studentAnswer: ( Đây là đáp án của học sinh dạng chuỗi)
        }
        Việc của bạn là chấm điểm và trả về mảng các Object dạng như sau 
        {
        id: (Là ID của Object ban đầu, được tôi cung cấp),
        score: (chấm điểm studentAnswer dựa vào answer được cung cấp( điểm từ 0 đếm 100),
        evaluate: (Đây là nhận xét cho câu trả lời, chỉ được nhận xét chung chung, ví dụ: Câu trả lời thiếu bản chất vấn đề, câu trả lời chưa làm rõ cơ chế..., không được trả lời là câu trả lời của học sinh thiếu chữ nào câu nào đó để tranh lộ đáp án)
        }
        Ngôn ngữ trả về là tiếng việt
        Kết quả trả về phải là một mảng các Object
        
        Các trường hợp đặc biệt: 
        -Nếu không có studentAnswer trả về evaluate: "Đáp án chưa được ghi nhận"

        Dưới đây là mảng cần thao tác:
        ${JSON.stringify(promtESQuestions, null, 2)}
        `;
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });
      return result.response.text();
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
