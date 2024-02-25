import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

import { AppModule } from '~/infra/app.module'
import { DatabaseModule } from '~/infra/database/database.module'

import { StudentFactory } from 'test/factories/make-student'
describe('Create Session (e2e)', () => {
  let app: INestApplication

  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })
  test('[POST] /sessions', async () => {
    // Prepare
    const data = { email: 'john@doe.com', password: '123456' }
    await studentFactory.makePrismaStudent({
      email: data.email,
      password: await hash(data.password, 8),
    })
    // Actions
    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({ email: data.email, password: data.password })

    // Assert
    expect(response.statusCode).toBe(201)

    expect(response.body).toEqual({ access_token: expect.any(String) })
  })
})
