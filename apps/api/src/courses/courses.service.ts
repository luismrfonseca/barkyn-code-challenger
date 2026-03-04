import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { applyCourseLock } from './helpers/apply-course-lock.helper';
import { CompleteCourseDto } from './dto/complete-course.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService
  ) { }

  async findAll(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }

    const courses = await this.prisma.course.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
    });

    return applyCourseLock(courses, enrollments);
  }

  async findOne(id: string) {
    return this.prisma.course.findUnique({ where: { id } });
  }

  async complete(completeCourseDto: CompleteCourseDto) {
    return this.prisma.$transaction(async (tx) => {
      const { userId, courseId } = completeCourseDto;

      if (!userId || !courseId) {
        throw new UnauthorizedException('User ID and Course ID are required');
      }

      const user = await this.userService.findOne(userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const course = await this.findOne(courseId);

      if (!course) {
        throw new UnauthorizedException('Course not found');
      }

      // 1. Verifica se o usuário está inscrito no curso
      const enrollment = await tx.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });

      if (!enrollment) {
        throw new BadRequestException('User is not enrolled in this course');
      }

      if (enrollment?.status === 'COMPLETED') {
        throw new BadRequestException('User is already completed this course');
      }

      await tx.course.update({
        where: { id: courseId },
        data: { availableSlots: { increment: 1 } },
      });

      // 2. Atualiza o status do curso para COMPLETED
      await tx.enrollment.update({
        where: { userId_courseId: { userId, courseId } },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });

      return { message: 'Curso completado com sucesso' };
    });
  }
}
