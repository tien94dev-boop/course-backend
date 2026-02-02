import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassGroup, ClassGroupSchema } from './schemas/class-group.schema';
import { ClassGroupService } from './class-group.service';
import { ClassGroupResolver } from './class-group.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClassGroup.name, schema: ClassGroupSchema },
    ]),
  ],
  providers: [ClassGroupResolver, ClassGroupService],
  exports: [ClassGroupService],
})
export class ClassGroupModule {}
