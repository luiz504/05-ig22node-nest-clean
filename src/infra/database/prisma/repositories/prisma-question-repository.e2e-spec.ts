import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '~/infra/app.module'
import { DatabaseModule } from '~/infra/database/database.module'
import { CacheRepository } from '~/infra/cache/cache-repository'

import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { QuestionsRepository } from '~/domain/forum/application/repositories/question-repository'

describe('Prisma Questions Repository (e2e)', () => {
  let app: INestApplication

  let cacheRepository: CacheRepository
  let studentFactory: StudentFactory
  let questionRepository: QuestionsRepository
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    cacheRepository = moduleRef.get(CacheRepository)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    questionRepository = moduleRef.get(QuestionsRepository)

    await app.init()
  })
  describe('findDetailsBySlug Cache', () => {
    it('should cache question details', async () => {
      // Prepare
      const user = await studentFactory.makePrismaStudent()

      const question = await questionFactory.makePrismaQuestion({
        authorId: user.id,
      })

      const attachment = await attachmentFactory.makePrismaAttachment()

      await questionAttachmentFactory.makePrismaQuestionAttachment({
        attachmentId: attachment.id,
        questionId: question.id,
      })

      const slug = question.slug.value
      // Actions
      const questionDetails = await questionRepository.findDetailsBySlug(slug)
      // Assert

      const cached = await cacheRepository.get(`question:${slug}:details`)
      expect(cached).toBe(JSON.stringify(questionDetails))
    })
    it('should  return cached question details on subsequent calls', async () => {
      // Prepare
      const user = await studentFactory.makePrismaStudent()

      const question = await questionFactory.makePrismaQuestion({
        authorId: user.id,
      })

      const attachment = await attachmentFactory.makePrismaAttachment()

      await questionAttachmentFactory.makePrismaQuestionAttachment({
        attachmentId: attachment.id,
        questionId: question.id,
      })

      const slug = question.slug.value

      await cacheRepository.set(
        `question:${slug}:details`,
        JSON.stringify({ mock: true }),
      )
      // Actions
      const questionDetails = await questionRepository.findDetailsBySlug(slug)

      // Assert

      expect(questionDetails).toEqual({ mock: true })
    })
  })

  describe('save Cache', () => {
    it('should delete question details cache when saving the question', async () => {
      // Prepare
      const user = await studentFactory.makePrismaStudent()

      const question = await questionFactory.makePrismaQuestion({
        authorId: user.id,
      })

      const attachment = await attachmentFactory.makePrismaAttachment()

      await questionAttachmentFactory.makePrismaQuestionAttachment({
        attachmentId: attachment.id,
        questionId: question.id,
      })

      const slug = question.slug.value

      await cacheRepository.set(
        `question:${slug}:details`,
        JSON.stringify({ mock: true }),
      )
      // Actions
      await questionRepository.save(question)

      // Assert
      const cached = await cacheRepository.get(`question:${slug}:details`)

      expect(cached).toBeNull()
    })
  })
})
