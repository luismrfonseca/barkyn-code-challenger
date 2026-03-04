import { Test, TestingModule } from '@nestjs/testing';
import { EnrollController } from './enroll.controller';
import { EnrollService } from './enroll.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';

describe('EnrollController', () => {
  let controller: EnrollController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollController],
      providers: [
        EnrollService,
        { provide: PrismaService, useValue: {} },
        { provide: UsersService, useValue: {} },
        { provide: CoursesService, useValue: {} },
      ],
    }).compile();

    controller = module.get<EnrollController>(EnrollController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
