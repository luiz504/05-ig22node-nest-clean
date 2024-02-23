import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { expect } from 'vitest'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'

import { PrismaService } from '~/infra/database/prisma/prisma.service'
import { AppModule } from '~/infra/app.module'

describe('Fetch Recent Questions (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })
  test('[GET] /questions', async () => {
    // Prepare
    const user = await prisma.user.create({
      data: {
        name: 'John',
        email: 'john@email.com',
        password: '123456',
      },
    })
    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: 'Question 01',
          content: 'Question Content',
          slug: 'question-01',
          authorId: user.id,
        },
        {
          title: 'Question 02',
          content: 'Question Content',
          slug: 'question-02',
          authorId: user.id,
        },
      ],
    })
    // Actions
    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', 'Bearer ' + accessToken)
      .send()

    // Assert
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Question 01' }),
        expect.objectContaining({ title: 'Question 02' }),
      ],
    })
  })
})
