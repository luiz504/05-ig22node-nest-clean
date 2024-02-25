import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { expect } from 'vitest'
import request from 'supertest'

import { AppModule } from '~/infra/app.module'
import { DatabaseModule } from '~/infra/database/database.module'

import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'

describe('Fetch Question Comments (e2e)', () => {
  let app: INestApplication

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

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

    await app.init()
  })
  test('[GET] /questions/:questionId/answers', async () => {
    // Prepare
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const questionId = question.id.toString()
    await Promise.all([
      questionCommentFactory.makePrismaQuestionComment({
        questionId: question.id,
        authorId: user.id,
        content: 'Question Comment 01 Content',
      }),
      questionCommentFactory.makePrismaQuestionComment({
        questionId: question.id,
        authorId: user.id,
        content: 'Question Comment 02 Content',
      }),
    ])

    // Actions
    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/comments`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send()

    // Assert
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({ content: 'Question Comment 01 Content' }),
        expect.objectContaining({ content: 'Question Comment 02 Content' }),
      ]),
    })
  })
})
