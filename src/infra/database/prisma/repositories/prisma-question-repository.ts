import { Injectable } from '@nestjs/common'

import { PaginationParams } from '~/core/repositories/pagination-params'

import { QuestionsRepository } from '~/domain/forum/application/repositories/question-repository'
import { Question } from '~/domain/forum/enterprise/entities/question'
import { QuestionAttachmentsRepository } from '~/domain/forum/application/repositories/question-attachment-repository'

import { PrismaService } from '~/infra/database/prisma/prisma.service'
import { PrismaQuestionMapper } from '~/infra/database/prisma/mappers/prisma-question-mapper'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly questionAttachments: QuestionAttachmentsRepository,
  ) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({ where: { id } })

    if (!question) return null

    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({ where: { slug } })
    if (!question) return null

    return PrismaQuestionMapper.toDomain(question)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const perPage = 20
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistance(question)

    await this.prisma.question.create({ data })

    await this.questionAttachments.createMany(question.attachments.getItems())
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistance(question)

    await Promise.all([
      this.prisma.question.update({ where: { id: data.id }, data }),
      this.questionAttachments.createMany(question.attachments.getNewItems()),
      this.questionAttachments.deleteMany(
        question.attachments.getRemovedItems(),
      ),
    ])
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({ where: { id: question.id.toString() } })
  }
}
