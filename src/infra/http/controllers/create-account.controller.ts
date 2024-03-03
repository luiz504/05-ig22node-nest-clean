import {
  ConflictException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  BadRequestException,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'

import { RegisterStudentUseCase } from '~/domain/forum/application/use-cases/account/register-student'
import { StudentAlreadyExistsError } from '~/domain/forum/application/use-cases/errors/student-already-exists-error'

import { Public } from '~/infra/auth/public'
import { ZodValidationPipe } from '~/infra/http/pipes/zod-validation.pipe'

const createAccountBodySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
})

type CreateAccountBody = z.infer<typeof createAccountBodySchema>

@ApiTags('Accounts')
@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private readonly registerStudent: RegisterStudentUseCase) {}
  @ApiOperation({ description: 'Create student account' })
  @ApiBody({
    schema: {
      ...zodToOpenAPI(createAccountBodySchema),
      example: { name: 'John', email: 'john@email.com', password: '123456' },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict, Email already exists.',
  })
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBody) { //eslint-disable-line 
    const { name, email, password } = body

    const result = await this.registerStudent.execute({ name, email, password })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
