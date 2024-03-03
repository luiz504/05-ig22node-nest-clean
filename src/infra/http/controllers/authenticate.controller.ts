import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'

import { AuthenticateStudentUseCase } from '~/domain/forum/application/use-cases/account/authenticate-student'
import { WrongCredentialsError } from '~/domain/forum/application/use-cases/errors/wrong-credentials-error'

import { Public } from '~/infra/auth/public'
import { ZodValidationPipe } from '~/infra/http/pipes/zod-validation.pipe'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
const responseSchema = z.object({ access_token: z.string() })

type AuthenticateBody = z.infer<typeof authenticateBodySchema>

type Response = z.infer<typeof responseSchema>
@ApiTags('Sessions')
@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(
    private readonly authenticateUseCase: AuthenticateStudentUseCase,
  ) {}

  @ApiOperation({ description: 'Create session' })
  @ApiBody({
    schema: {
      ...zodToOpenAPI(authenticateBodySchema),
      example: { name: 'John', email: 'john@email.com', password: '123456' },
    },
  })
  @ApiResponse({
    status: 201,
    schema: zodToOpenAPI(responseSchema),
    description: 'Session created successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBody): Promise<Response> {
    const { email, password } = body

    const result = await this.authenticateUseCase.execute({ email, password })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
