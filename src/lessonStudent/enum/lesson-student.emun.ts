
import { registerEnumType } from '@nestjs/graphql';
export enum LessonType {
    TEXT = 'TEXT',
    FILE = 'FILE',
    EXERCISE = "EXERCISE"
  }

registerEnumType(LessonType, {
    name: 'LessonType',
});
