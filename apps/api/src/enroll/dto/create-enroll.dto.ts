import { IsString } from 'class-validator';

export class CreateEnrollDto {
    @IsString()
    userId: string;

    @IsString()
    courseId: string;
}
