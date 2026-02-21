
import { registerEnumType } from '@nestjs/graphql';
export enum LessonType {
    TEXT = 'TEXT',
    FILE = 'FILE',
  }

registerEnumType(LessonType, {
    name: 'LessonType',
});
