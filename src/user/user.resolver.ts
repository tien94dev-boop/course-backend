import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Subscription,
  Context,
} from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserInput } from './dto/create-user.input';
import { UserMutationResponse } from '@/user/models/user.model';
import { UpdateUserInput } from './dto/update-user.input';
import { PubSub } from 'graphql-subscriptions';
import { ChangedPayload } from '../common/dto/changed.payload';
import { GqlAuthGuard } from '@/auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { FilterUserInput } from "@/user/dto/filter-user.input"
import type { GqlContext } from '@/common/gql-context';
import { buildFilter } from '@/utils/buildFilter';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Subscription(() => ChangedPayload, { name: 'userChanged' })
  userChanged(
    @Args('operation', { type: () => String, nullable: true })
    operation?: string,
  ) {
    return this.pubSub.asyncIterableIterator('userChanged');
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: any) {
    return this.userService.findOne(user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [User], {
    name: 'allUsers',
    description: 'Lấy danh sách toàn bộ sinh viên',
  })
  async allUsers(
    @Context() { req, res }: GqlContext,
    @Args("filter") filter: FilterUserInput
  ): Promise<User[]> {
    const userId = req.user.userId;
    const filters = buildFilter(filter);
    const users = await this.userService.findAll({filters});
    return users;
  }

  @Query(() => User, {
    name: 'getUser',
    description: 'Lấy thông tin chi tiết một sinh viên',
  })
  async getUser(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Mutation(() => UserMutationResponse, {
    description: 'Tạo mới một sinh viên vào hệ thống',
  })
  async createUser(
    @Args('input') input: CreateUserInput,
  ): Promise<UserMutationResponse> {
    try {
      return this.userService.create(input);
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Đã có lỗi xảy ra khi tạo sinh viên',
        data: null,
      };
    }
  }

  @Mutation(() => UserMutationResponse)
  async updateUser(
    @Args('input') input: UpdateUserInput,
  ): Promise<UserMutationResponse> {
    try {
      const result = await this.userService.update(input);
      return result;
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Đã có lỗi xảy ra khi cập nhật sinh viên',
        data: null,
      };
    }
  }
}
