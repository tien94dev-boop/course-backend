import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiResolver, MCOptionResolver, QuestionDetailResolver } from './ai.resolver';

@Module({
  providers: [AiService, AiResolver, MCOptionResolver, QuestionDetailResolver],
})
export class AiModule {}
