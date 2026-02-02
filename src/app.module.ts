import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { CourseModule } from './course/course.module';
import { ClassGroupModule } from './class-group/class-group.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/course_db'),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),

    CourseModule,
    ClassGroupModule,
  ],
})
export class AppModule {}
