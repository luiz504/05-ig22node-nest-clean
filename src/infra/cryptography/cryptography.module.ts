import { Module } from '@nestjs/common'

import { Encrypter } from '~/domain/forum/application/cryptography/encrypter'
import { HashComparer } from '~/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '~/domain/forum/application/cryptography/hash-generator'

import { BcryptHasher } from '~/infra/cryptography/bcrypt-hasher'
import { JWTEncrypter } from '~/infra/cryptography/jwt-encrypter'

@Module({
  providers: [
    { provide: Encrypter, useClass: JWTEncrypter },
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: HashComparer, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashGenerator, HashComparer],
})
export class CryptographyModule {}
