import { Controller, Get, Patch, Body, Headers } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CompleteCourseDto } from './dto/complete-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Get()
  findAll(@Headers('x-user-id') userId: string) {
    return this.coursesService.findAll(userId);
  }

  @Patch('complete')
  complete(@Body() completeCourseDto: CompleteCourseDto) {
    return this.coursesService.complete(completeCourseDto);
  }
}
