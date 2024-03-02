import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from './env/env'

import { AuthModule } from './auth/auth.module'
import { HTTPModule } from './http/http.module'
import { EnvModule } from '~/infra/env/env.module'
import { StorageModule } from '~/infra/storage/storage.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (envs) => envSchema.parse(envs),
      isGlobal: true,
    }),
    AuthModule,
    HTTPModule,
    EnvModule,
    StorageModule,
  ],
})
export class AppModule {}
