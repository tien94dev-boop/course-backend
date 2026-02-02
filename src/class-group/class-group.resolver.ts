import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { ClassGroupService } from './class-group.service';
import { ClassGroup } from './schemas/class-group.schema';

@Resolver(() => ClassGroup)
export class ClassGroupResolver {
  constructor(private readonly classGroupService: ClassGroupService) {}

  @Query(() => [ClassGroup])
  classGroups() {
    return this.classGroupService.findAll();
  }

  @Mutation(() => ClassGroup)
  createClassGroup(
    @Args('grade', { type: () => Int }) grade: number,
    @Args('name') name: string,
    @Args('schoolYear', { nullable: true }) schoolYear?: string,
  ) {
    return this.classGroupService.create({
      grade,
      name,
      schoolYear,
    });
  }
}
