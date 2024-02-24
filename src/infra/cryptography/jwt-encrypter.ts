import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Encrypter } from '~/domain/forum/application/cryptography/encrypter'
@Injectable()
export class JWTEncrypter implements Encrypter {
  constructor(private readonly jwtService: JwtService) {}
  encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload)
  }
}
