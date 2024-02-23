import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { expect } from 'vitest'

import { PrismaService } from '~/infra/prisma/prisma.service'
import { AppModule } from '~/infra/app.module'
describe('Create Question (e2e)', () => {
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
  test('[POST] /questions', async () => {
    // Prepare
    const user = await prisma.user.create({
      data: {
        name: 'John',
        email: 'john@email.com',
        password: '123456',
      },
    })
    const accessToken = jwt.sign({ sub: user.id })
    const data = { title: 'Some question', content: 'Question Content' }

    // Actions
    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(data)

    // Assert
    expect(response.statusCode).toBe(201)
    const questionOnDatabase = await prisma.question.findFirst({
      where: { title: data.title },
    })

    expect(questionOnDatabase).toBeTruthy()
  })
})
