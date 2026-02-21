import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AiGenerateInput } from '@/ai/dto/ai-generate.input'

@Injectable()
export class AiService {
    // Khởi tạo SDK với API Key từ môi trường
    private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    async generateRawText({ content, language="vi", questionTypes }: AiGenerateInput) {
        // Gọi đúng model 2.5 mà bạn đang có quyền truy cập

        let questionString: string[] = []
        for (const qt of questionTypes) {
            const { type, numberOfQuestions } = qt
            if (numberOfQuestions > 0) {
                const reqString = `${numberOfQuestions} câu ${type === "ES" ? "Tự luận" : 'Trắc nghiệm'}`
                questionString.push(reqString)
            }
        }
        const MCForm = `{
            "question": "...",
            mcOption: là một mảng dạng {choice: A|B|C|D, description: nội dung các đáp án}, và nhớ chỉ có duy nhất 1 đáp án đúng
            "answer": 1 trong 4 đáp án A, B, C, D,
            "questionType:  luôn là MC
        }
        `

        const ESForm = `{
            "question": "...",
            "answer": Là chuỗi đáp án đầy đủ ngắn gọn nhất phụ thuộc vào nội dung được cung cấp,
            "questionType:  luôn là ES
        }`


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
        ${questionString.join(",")}

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
                    // Ép model 2.5 trả về JSON object
                    responseMimeType: 'application/json',
                },
            });

            // Đối với SDK mới, bạn lấy kết quả qua .response.text()
            return result.response.text();
        } catch (error) {
            console.error('Lỗi khi gọi Gemini 2.5:', error);
            throw new Error('Không thể kết nối với AI Model 2.5');
        }
    }
}