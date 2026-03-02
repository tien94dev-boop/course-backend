import { Resolver, ResolveField, Parent, Context } from '@nestjs/graphql';
import {
  QuestionDetail,
  QuestionDetailSchema,
} from '@/ai/models/ai-generate.model';
import type { GqlContext } from '@/common/gql-context';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@/user/schemas/user.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/auth/gql-auth.guard';

@Resolver(() => QuestionDetail)
export class QuestionDetailResolver {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}
 @UseGuards(GqlAuthGuard)
  @ResolveField(() => String, { nullable: true })
  async answer(
    @Parent() question: QuestionDetail,
    @Context() { req }: GqlContext,
  ) {
    const userId = req?.user.userId || null;
    if(!userId){
        return null
    }
    const user = await this.userModel.findOne({ _id: new ObjectId(userId) });
    if (user?.role === 'STUDENT') {
      return null;
    }

    return question.answer;
  }
}
