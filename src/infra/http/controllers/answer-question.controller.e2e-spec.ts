import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { expect } from 'vitest'

import { PrismaService } from '~/infra/database/prisma/prisma.service'
import { DatabaseModule } from '~/infra/database/database.module'
import { AppModule } from '~/infra/app.module'

import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'

import { AttachmentFactory } from 'test/factories/make-attachment'

describe('Answer Question (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    await app.init()
  })
  test('[POST] /questions/:questionId/answers', async () => {
    // Prepare
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const questionId = question.id.toString()

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    // Actions
    const response = await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        content: 'Answer Content',
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      })

    // Assert
    expect(response.statusCode).toBe(201)
    const answerOnDatabase = await prisma.answer.findFirst({
      where: { content: 'Answer Content' },
    })

    expect(answerOnDatabase).toBeTruthy()
    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: { answerId: answerOnDatabase?.id },
    })

    expect(attachmentsOnDatabase.length).toBe(2)
  })
})
