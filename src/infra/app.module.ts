import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from './env'

import { AuthModule } from './auth/auth.module'
import { HTTPModule } from './http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (envs) => envSchema.parse(envs),
      isGlobal: true,
    }),
    AuthModule,
    HTTPModule,
  ],
})
export class AppModule {}
