import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) { }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    });
  }
}
