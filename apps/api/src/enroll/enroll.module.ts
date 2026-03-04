import { Module } from '@nestjs/common';
import { EnrollService } from './enroll.service';
import { EnrollController } from './enroll.controller';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';

@Module({
  controllers: [EnrollController],
  providers: [EnrollService, UsersService, CoursesService],
})
export class EnrollModule { }
