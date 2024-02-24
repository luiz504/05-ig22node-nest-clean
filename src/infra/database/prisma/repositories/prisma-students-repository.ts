import { Injectable } from '@nestjs/common'

import { StudentsRepository } from '~/domain/forum/application/repositories/students-repository'
import { Student } from '~/domain/forum/enterprise/entities/student'

import { PrismaStudentMapper } from '~/infra/database/prisma/mappers/prisma-student-mapper'
import { PrismaService } from '~/infra/database/prisma/prisma.service'
@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({ where: { email } })
    if (!student) return null

    return PrismaStudentMapper.toDomain(student)
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPersistance(student)
    await this.prisma.user.create({ data })
  }
}
