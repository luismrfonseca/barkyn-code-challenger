import { Test, TestingModule } from '@nestjs/testing';
import { EnrollService } from './enroll.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';

describe('EnrollService', () => {
  let service: EnrollService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollService,
        { provide: PrismaService, useValue: {} },
        { provide: UsersService, useValue: {} },
        { provide: CoursesService, useValue: {} },
      ],
    }).compile();

    service = module.get<EnrollService>(EnrollService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
