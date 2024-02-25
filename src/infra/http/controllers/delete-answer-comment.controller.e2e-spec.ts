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
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { QuestionFactory } from 'test/factories/make-question'

describe('Delete Answer Comment (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AnswerCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)

    await app.init()
  })
  test('[DELETE] /answers/comments/:answerCommentId', async () => {
    // Prepare
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    const answerComment = await answerCommentFactory.makePrismaAnswerComment({
      answerId: answer.id,
      authorId: user.id,
    })
    const answerCommentId = answerComment.id.toString()

    // Actions
    const response = await request(app.getHttpServer())
      .delete(`/answers/comments/${answerCommentId}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send()

    // Assert
    expect(response.statusCode).toBe(204)
    const answerCommentOnDatabase = await prisma.comment.findUnique({
      where: { id: answerCommentId },
    })

    expect(answerCommentOnDatabase).toBeNull()
  })
})
