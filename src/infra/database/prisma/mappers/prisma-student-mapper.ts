import { Prisma, User as PrismaStudent } from '@prisma/client'
import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { Student } from '~/domain/forum/enterprise/entities/student'

export class PrismaStudentMapper {
  static toDomain(raw: PrismaStudent): Student {
    return Student.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistance(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password,
    }
  }
}
