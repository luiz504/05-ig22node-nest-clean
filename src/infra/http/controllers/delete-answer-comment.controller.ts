import {
  BadRequestException,
  NotFoundException,
  Controller,
  Delete,
  Param,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common'
import { NotAllowedError } from '~/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '~/core/errors/resource-not-found-error'
import { DeleteAnswerCommentsUseCase } from '~/domain/forum/application/use-cases/comment-answer/delete-answer-comment'

import { CurrentUser } from '~/infra/auth/current-user-decorator'
import { UserPayload } from '~/infra/auth/jwt.strategy'

@Controller('/answers/comments/:answerCommentId')
export class DeleteAnswerCommentController {
  constructor(
    private readonly deleteAnswerComment: DeleteAnswerCommentsUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerCommentId') answerCommentId: string,
  ) {
    const { sub: userId } = user

    const result = await this.deleteAnswerComment.execute({
      answerCommentId,
      authorId: userId,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
