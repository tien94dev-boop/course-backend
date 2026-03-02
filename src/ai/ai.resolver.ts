import {
  Args,
  Mutation,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AiService } from './ai.service';
import { AiGenerateInput } from './dto/ai-generate.input';
import { AiGenerateResponse } from './models/ai-generate.model';
import { ObjectId } from 'mongodb';
import { MCOption, QuestionDetail } from './models/ai-generate.model';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/auth/gql-auth.guard';

@Resolver(() => MCOption)
export class MCOptionResolver {
  @ResolveField(() => String)
  id(@Parent() parent: any) {
    return parent._id?.toString();
  }
}

@Resolver(() => QuestionDetail)
export class QuestionDetailResolver {
  @ResolveField(() => String)
  id(@Parent() parent: any) {
    return parent._id?.toString();
  }
}

@Resolver()
export class AiResolver {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => AiGenerateResponse)
  async aiGenerateQuestion(@Args('input') input: AiGenerateInput) {
    const { content, language, questionTypes } = input;
    const rs = await this.aiService.generateRawText({
      content,
      language,
      questionTypes,
    });

    const questions = JSON.parse(rs);
    return {
      questions: questions.map((question: any) => {
        const mcOptions = (question?.mcOption || []).map((option: any) => {
          return {
            _id: new ObjectId().toString(),
            ...option,
          };
        });
        return {
          ...question,
          _id: new ObjectId().toString(),
          mcOptions,
        };
      }),
    };
  }
}
