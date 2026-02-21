import { ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '@/common/models/base-response.output';
import { Chapter } from '@/chapter/schemas/chapter.schema';


@ObjectType()
export class ChapterMutationResponse extends BaseResponse(Chapter) {}