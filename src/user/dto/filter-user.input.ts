
import { Field, InputType } from "@nestjs/graphql";
import { UserRole } from '../models/user.emun';

@InputType()
export class FilterUserInput {
  @Field(() => UserRole, { nullable: false })
  role!: UserRole;

}