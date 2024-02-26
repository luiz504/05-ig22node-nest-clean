import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'

import { AppModule } from '~/infra/app.module'
import { DatabaseModule } from '~/infra/database/database.module'

import { StudentFactory } from 'test/factories/make-student'

describe('Upload Attachment (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })
  test('[POST] /attachments', async () => {
    // Prepare
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    // Actions
    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', 'Bearer ' + accessToken)
      .attach('file', './test/e2e/sample-upload.jpeg')

    // Assert
    expect(response.statusCode).toBe(201)
  })
})
