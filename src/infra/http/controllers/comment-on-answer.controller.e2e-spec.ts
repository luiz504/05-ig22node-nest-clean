import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { expect } from 'vitest'

import { PrismaService } from '~/infra/database/prisma/prisma.service'
import { DatabaseModule } from '~/infra/database/database.module'
import { AppModule } from '~/infra/app.module'

import { StudentFactory } from 'test/factories/make-student'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
describe('Comment on Answer (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })
  test('[POST] /answers/:answerId/comments', async () => {
    // Prepare
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    })
    const answerId = answer.id.toString()
    // Actions

    const response = await request(app.getHttpServer())
      .post(`/answers/${answerId}/comments`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ content: 'Comment Answer Content' })

    // Assert
    expect(response.statusCode).toBe(201)
    const commentOnDatabase = await prisma.comment.findFirst({
      where: { content: 'Comment Answer Content' },
    })

    expect(commentOnDatabase).toBeTruthy()
  })
})
