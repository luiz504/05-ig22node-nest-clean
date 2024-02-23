import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '~/infra/app.module'
import { PrismaService } from '~/infra/prisma/prisma.service'
describe('Create Account (e2e)', () => {
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
  test('[POST] /account', async () => {
    const data = { name: 'John Doe', email: 'john@doe.com', password: '123456' }

    // Actions
    const response = await request(app.getHttpServer())
      .post('/accounts')
      .send(data)

    // Assert
    expect(response.statusCode).toBe(201)
    const useOnDatabase = await prisma.user.findUnique({
      where: { email: data.email },
    })

    expect(useOnDatabase).toBeTruthy()
  })
})
