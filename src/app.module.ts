import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { CourseModule } from './course/course.module';
import { ClassGroupModule } from './class-group/class-group.module';
import { AiModule } from './ai/ai.module';
import { UserModule } from "./user/user.module";
import { ChapterModule } from './chapter/chapter.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PubSubModule } from './common/pubsub/pubsub.module';
import { Schema } from 'mongoose';  // Giữ import này
import { LessonModule } from './lesson/lesson.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': true,
      },
      context: ({ req, res }) => ({ req, res }),
    }),

    CourseModule,
    ClassGroupModule,
    AiModule,
    UserModule,
    ChapterModule,
    PubSubModule,
    LessonModule,
    AuthModule
  ],
})
export class AppModule {}