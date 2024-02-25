import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { AnswerQuestionUseCase } from '~/domain/forum/application/use-cases/answer/answer-question'

import { CurrentUser } from '~/infra/auth/current-user-decorator'
import { UserPayload } from '~/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '~/infra/http/pipes/zod-validation.pipe'

const createAnswerQuestionSchema = z.object({ content: z.string().min(1) })

type CreateAnswerQuestionSchema = z.infer<typeof createAnswerQuestionSchema>

const bodyValidationPipe = new ZodValidationPipe(createAnswerQuestionSchema)
@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private readonly createAnswer: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateAnswerQuestionSchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body
    const { sub: userId } = user

    const result = await this.createAnswer.execute({
      content,
      questionId,
      authorId: userId,
      attachmentIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
