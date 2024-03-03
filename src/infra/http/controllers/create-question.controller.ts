import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

import { CreateQuestionUseCase } from '~/domain/forum/application/use-cases/question/create-question'

import { CurrentUser } from '~/infra/auth/current-user-decorator'
import { UserPayload } from '~/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '~/infra/http/pipes/zod-validation.pipe'

const createQuestionBodySchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  attachments: z.array(z.string().uuid()).optional().default([]),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)
@ApiTags('Questions')
@ApiBearerAuth()
@Controller('/questions')
export class CreateQuestionController {
  constructor(private readonly createQuestion: CreateQuestionUseCase) {}
  @ApiOperation({
    description: 'Create student account',
  })
  @ApiBody({
    schema: {
      ...zodToOpenAPI(createQuestionBodySchema),
      example: { title: 'Question Title', content: 'Question Content' },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully.',
  })
  @Post()
  async handle(
    @Body(bodyValidationPipe)
    body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content, attachments } = body
    const { sub: userId } = user

    const result = await this.createQuestion.execute({
      authorId: userId,
      title,
      content,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
