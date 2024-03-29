import { Injectable } from '@nestjs/common'

import { PaginationParams } from '~/core/repositories/pagination-params'
import { DomainEvents } from '~/core/events/domain-events'

import { QuestionsRepository } from '~/domain/forum/application/repositories/question-repository'
import { Question } from '~/domain/forum/enterprise/entities/question'
import { QuestionAttachmentsRepository } from '~/domain/forum/application/repositories/question-attachment-repository'
import { QuestionDetails } from '~/domain/forum/enterprise/entities/value-objects/question-details'

import { PrismaService } from '~/infra/database/prisma/prisma.service'
import { PrismaQuestionMapper } from '~/infra/database/prisma/mappers/prisma-question-mapper'
import { PrismaQuestionDetailsMapper } from '~/infra/database/prisma/mappers/prisma-question-details-mapper'
import { CacheRepository } from '~/infra/cache/cache-repository'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheRepository,
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
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

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheKey = `question:${slug}:details`
    const cachedHit = await this.cache.get(cacheKey)

    if (cachedHit) {
      const cachedData = JSON.parse(cachedHit)

      return cachedData
    }

    const question = await this.prisma.question.findUnique({
      where: { slug },
      include: { author: true, attachments: true },
    })

    if (!question) return null

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)

    await this.cache.set(cacheKey, JSON.stringify(questionDetails))
    return questionDetails
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

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistance(question)

    await Promise.all([
      this.prisma.question.update({ where: { id: data.id }, data }),
      this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
      this.cache.delete(`question:${data.slug}:details`),
    ])
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({ where: { id: question.id.toString() } })
  }
}
