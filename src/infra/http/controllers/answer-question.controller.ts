import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'

import { AnswerQuestionUseCase } from '~/domain/forum/application/use-cases/answer/answer-question'

import { CurrentUser } from '~/infra/auth/current-user-decorator'
import { UserPayload } from '~/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '~/infra/http/pipes/zod-validation.pipe'

const createAnswerQuestionBodySchema = z.object({
  content: z.string().min(1),
  attachments: z.array(z.string().uuid()).optional().default([]),
})

type CreateAnswerQuestionBodySchema = z.infer<
  typeof createAnswerQuestionBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(createAnswerQuestionBodySchema)
@ApiTags('Answers')
@ApiBearerAuth()
@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private readonly createAnswer: AnswerQuestionUseCase) {}

  @ApiOperation({ description: 'Create Answer to a Question' })
  @ApiBody({ schema: zodToOpenAPI(createAnswerQuestionBodySchema) })
  @ApiResponse({ status: 201, description: 'Answer created with success!' })
  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateAnswerQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
  ) {
    const { content, attachments } = body
    const { sub: userId } = user

    const result = await this.createAnswer.execute({
      content,
      questionId,
      authorId: userId,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
