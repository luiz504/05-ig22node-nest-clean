import { Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/questions')
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async handle() {
    return 'ok'
  }
}
