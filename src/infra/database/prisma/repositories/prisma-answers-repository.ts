import { Injectable } from '@nestjs/common'

import { PaginationParams } from '~/core/repositories/pagination-params'
import { AnswersRepository } from '~/domain/forum/application/repositories/answers-repository'
import { Answer } from '~/domain/forum/enterprise/entities/answer'
import { PrismaAnswerMapper } from '~/infra/database/prisma/mappers/prisma-answer-mapper'
import { PrismaService } from '~/infra/database/prisma/prisma.service'
@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistance(answer)

    await this.prisma.answer.create({ data })
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({ where: { id } })

    if (!answer) return null

    return PrismaAnswerMapper.toDomain(answer)
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const perPage = 20
    const answers = await this.prisma.answer.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistance(answer)

    await this.prisma.answer.create({ data })
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({ where: { id: answer.id.toString() } })
  }
}
