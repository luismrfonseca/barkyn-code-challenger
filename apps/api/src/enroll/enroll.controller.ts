import { Controller, Post, Body } from '@nestjs/common';
import { EnrollService } from './enroll.service';
import { CreateEnrollDto } from './dto/create-enroll.dto';

@Controller('enroll')
export class EnrollController {
  constructor(private readonly enrollService: EnrollService) {}

  @Post()
  reserve(@Body() createEnrollDto: CreateEnrollDto) {
    return this.enrollService.reserve(createEnrollDto);
  }
}