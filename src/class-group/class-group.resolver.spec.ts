import { Test, TestingModule } from '@nestjs/testing';
import { ClassGroupResolver } from './class-group.resolver';

describe('ClassGroupResolver', () => {
  let resolver: ClassGroupResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassGroupResolver],
    }).compile();

    resolver = module.get<ClassGroupResolver>(ClassGroupResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
