import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassGroup } from './schemas/class-group.schema';
import { CreateCourseInput } from './dto/create-class-group.input';
import { UpdateCourseInput } from './dto/update-class-group.input';

@Injectable()
export class ClassGroupService {
  constructor(
    @InjectModel(ClassGroup.name)
    private classGroupModel: Model<ClassGroup>,
  ) {}

  create(data: Partial<ClassGroup>) {
    return this.classGroupModel.create(data);
  }

  findAll() {
    return this.classGroupModel.find();
  }
}
