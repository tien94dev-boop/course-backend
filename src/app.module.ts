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
import { CourseStudentModule } from './courseStudent/course-student.module';
import { AuthModule } from './auth/auth.module';
import { LessonStudentModule } from'./lessonStudent/lesson-student.module';
// import * as mongoose from 'mongoose';

// const originalSetOptions = mongoose.Query.prototype.setOptions;

// mongoose.Query.prototype.setOptions = function (options: any, overwrite?: boolean) {
//   // Gọi hàm gốc trước
//   originalSetOptions.apply(this, arguments);

//   // Nếu chưa set lean (lean == null hoặc undefined), thì tự động set lean: true
//   if (this.mongooseOptions().lean == null) {
//     this.mongooseOptions({ lean: true });
//   }

//   return this;
// };

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
    AuthModule,
    CourseStudentModule,
    LessonStudentModule
  ],
})
export class AppModule {}