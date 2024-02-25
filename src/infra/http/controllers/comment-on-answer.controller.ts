import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFoundError } from '~/core/errors/resource-not-found-error'

import { CommentOnAnswerUseCase } from '~/domain/forum/application/use-cases/comment-answer/comment-on-answer'

import { CurrentUser } from '~/infra/auth/current-user-decorator'
import { UserPayload } from '~/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '~/infra/http/pipes/zod-validation.pipe'

const commentOnAnswerBodySchema = z.object({ content: z.string().min(1) })

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema)
@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private readonly commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const { content } = body

    const { sub: userId } = user

    const result = await this.commentOnAnswer.execute({
      answerId,
      authorId: userId,
      content,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
