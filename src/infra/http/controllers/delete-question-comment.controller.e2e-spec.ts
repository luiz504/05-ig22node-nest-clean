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
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
describe('Delete Question Comment (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

    await app.init()
  })
  test('[DELETE] /questions/comments/:questionCommentId', async () => {
    // Prepare
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const questionComment =
      await questionCommentFactory.makePrismaQuestionComment({
        questionId: question.id,
        authorId: user.id,
      })
    const questionCommentId = questionComment.id.toString()

    // Actions
    const response = await request(app.getHttpServer())
      .delete(`/questions/comments/${questionCommentId}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send()

    // Assert
    expect(response.statusCode).toBe(204)
    const questionCommentOnDatabase = await prisma.comment.findUnique({
      where: { id: questionCommentId },
    })

    expect(questionCommentOnDatabase).toBeNull()
  })
})
