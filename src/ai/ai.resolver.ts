import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AiService } from './ai.service';
import { AiGenerateInput } from './dto/ai-generate.input';
import { AiGenerateResponse } from './models/ai-generate.model';
import { ObjectId } from 'mongodb';


@Resolver()
export class AiResolver {
    constructor(private readonly aiService: AiService) { }

    @Mutation(() => AiGenerateResponse)
    async aiGenerateQuestion(
        @Args('input') input: AiGenerateInput,
    ) {
        const { content, language, questionTypes } = input
        const rs = await this.aiService.generateRawText({ content, language, questionTypes })

        const questions = JSON.parse(rs)
        console.log('Generated questions:', questions);
        return {
            questions: questions.map((question: any)=>{
                const mcOptions = (question?.mcOption || []).map((option: any)=>{
                    console.log('Processing option:', option);
                    return {
                        id: new ObjectId().toString(),
                        ...option
                    }
                })
                return {
                    ...question,
                    id: new ObjectId().toString(),
                    mcOptions
              
                }
            })
        };
    }
}