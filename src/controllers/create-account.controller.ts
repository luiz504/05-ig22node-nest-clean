import {
  ConflictException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash } from 'bcryptjs'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) {}
  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) { //eslint-disable-line 
    const { name, email, password } = body

    const useWithSameEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    if (useWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists.',
      )
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    })
  }
}
