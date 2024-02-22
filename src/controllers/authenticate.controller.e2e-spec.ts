import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '~/app.module'
import request from 'supertest'
import { PrismaService } from '~/prisma/prisma.service'
import { hash } from 'bcryptjs'
describe('Create Session (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })
  test('[POST] /sessions', async () => {
    // Prepare
    const data = { name: 'John Doe', email: 'john@doe.com', password: '123456' }
    await prisma.user.create({
      data: { ...data, password: await hash(data.password, 8) },
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
