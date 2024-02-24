import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

import { CreateQuestionUseCase } from '~/domain/forum/application/use-cases/question/create-question'

import { CurrentUser } from '~/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '~/infra/auth/jwt-auth.guard'
import { UserPayload } from '~/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '~/infra/http/pipes/zod-validation.pipe'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)
@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body
    const { sub: userId } = user

    const result = await this.createQuestion.execute({
      authorId: userId,
      title,
      content,
      attachmentIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
