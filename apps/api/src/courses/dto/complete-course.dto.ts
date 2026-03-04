import { IsString } from 'class-validator';

export class CompleteCourseDto {
    @IsString()
    userId: string;
    @IsString()
    courseId: string;
}
