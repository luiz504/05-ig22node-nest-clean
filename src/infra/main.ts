import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from '~/infra/env/env.service'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { patchNestJsSwagger } from 'nestjs-zod'
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  const envService = app.get(EnvService)
  const port = envService.get('PORT')

  const config = new DocumentBuilder()
    .setTitle('Ignite Forum API Documentation')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  patchNestJsSwagger()

  await app.listen(port)
}
bootstrap()
