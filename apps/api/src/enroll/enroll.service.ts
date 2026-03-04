import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEnrollDto } from './dto/create-enroll.dto';
import { PrismaService } from '../prisma/prisma.service';
import { applyCourseLock } from '../courses/helpers/apply-course-lock.helper';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class EnrollService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    private readonly coursesService: CoursesService,
  ) { }

  async reserve(createEnrollDto: CreateEnrollDto) {
    return this.prisma.$transaction(async (tx) => {
      const user = await this.userService.findOne(createEnrollDto.userId);

      if (!user) {
        throw new UnauthorizedException('Utilizador não encontrado');
      }

      const courseExists = await this.coursesService.findOne(createEnrollDto.courseId);

      if (!courseExists) {
        throw new UnauthorizedException('Curso não encontrado');
      }

      // 1. Verifica se o usuário já está inscrito no curso
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: createEnrollDto.userId,
            courseId: createEnrollDto.courseId,
          },
        },
      });

      if (existingEnrollment?.status === 'COMPLETED') {
        throw new BadRequestException('Utilizador já completou este curso');
      }

      if (existingEnrollment) {
        throw new ConflictException('Utilizador já está inscrito neste curso');
      }

      // 2. Encontra o curso e valida as vagas
      const courses = await this.prisma.course.findMany({
        orderBy: { sortOrder: 'asc' },
      });

      const enrollments = await this.prisma.enrollment.findMany({
        where: { userId: createEnrollDto.userId },
      });

      const course = applyCourseLock(courses, enrollments).find((c) => c.id === createEnrollDto.courseId && c.isLocked === false);

      if (!course) {
        throw new NotFoundException('Curso não disponível, por favor complete o curso anterior');
      }

      if (course.availableSlots <= 0) {
        throw new BadRequestException('Não há vagas disponíveis para este curso');
      }

      // 3. Decrementa as vagas disponíveis
      await tx.course.update({
        where: { id: createEnrollDto.courseId },
        data: { availableSlots: { decrement: 1 } },
      });

      // 4. Cria a inscrição
      await tx.enrollment.create({
        data: createEnrollDto,
      });

      return { message: 'Inscrição realizada com sucesso' };
    });
  }
}
