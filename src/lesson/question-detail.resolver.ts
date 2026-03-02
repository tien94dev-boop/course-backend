import { Resolver, ResolveField, Parent, Context } from '@nestjs/graphql';
import {
  QuestionDetail,
  QuestionDetailSchema,
} from '@/ai/models/ai-generate.model';
import type { GqlContext } from '@/common/gql-context';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/auth/gql-auth.guard';
import _ from 'lodash';

@Resolver(() => QuestionDetail)
export class QuestionDetailResolver {
  @UseGuards(GqlAuthGuard)
  @ResolveField(() => String, { nullable: true })
  async answer(
    @Parent() question: QuestionDetail,
    @Context() { req, res }: GqlContext,
  ) {
    const user = _.get(req, ['user'], null);
    if (!user) {
      return null;
    }
    if (user?.role === 'STUDENT') {
      return null;
    }

    return question.answer;
  }
}
