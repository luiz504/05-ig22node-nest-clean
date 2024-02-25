import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { expect } from 'vitest'
import request from 'supertest'

import { AppModule } from '~/infra/app.module'
import { DatabaseModule } from '~/infra/database/database.module'

import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch Recent Questions (e2e)', () => {
  let app: INestApplication

  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })
  test('[GET] /questions', async () => {
    // Prepare
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      questionFactory.makePrismaQuestion({
        title: 'Question 01',
        authorId: user.id,
      }),
      questionFactory.makePrismaQuestion({
        title: 'Question 02',
        authorId: user.id,
      }),
    ])

    // Actions
    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', 'Bearer ' + accessToken)
      .send()

    // Assert
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Question 02' }),
        expect.objectContaining({ title: 'Question 01' }),
      ],
    })
  })
})
