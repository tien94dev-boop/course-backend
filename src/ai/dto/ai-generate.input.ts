import { Field, InputType, registerEnumType, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum QuestionType {
    MC = 'MC',
    ES = 'ES',
}

export enum ChoiceId {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
  }

registerEnumType(QuestionType, {
    name: 'QuestionType',
});

@InputType()
export class QuestionTypeConfig {
    @Field(() => QuestionType)
    @IsNotEmpty()
    type!: QuestionType;

    @Field(() => Int)
    @Min(0)
    numberOfQuestions!: number;
}
@InputType()
export class AiGenerateInput {
    @Field()
    @IsNotEmpty({ message: 'Nội dung không được để trống' })
    @IsString()
    content!: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    customRequest?: string;

    @Field(() => [QuestionTypeConfig], { nullable: true })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionTypeConfig)
    questionTypes!: QuestionTypeConfig[];

    @Field({ defaultValue: 'vi' })
    language: string = 'vi';
}


