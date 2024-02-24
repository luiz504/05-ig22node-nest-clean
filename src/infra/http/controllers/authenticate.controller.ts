import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '~/infra/http/pipes/zod-validation.pipe'

import { AuthenticateStudentUseCase } from '~/domain/forum/application/use-cases/account/authenticate-student'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type AuthenticateBody = z.infer<typeof authenticateBodySchema>
@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private readonly authenticateUseCase: AuthenticateStudentUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBody) {
    const { email, password } = body

    const result = await this.authenticateUseCase.execute({ email, password })

    if (result.isLeft()) {
      throw new Error('Authenticate error.')
    }

    const { accessToken } = result.value
    return {
      access_token: accessToken,
    }
  }
}
