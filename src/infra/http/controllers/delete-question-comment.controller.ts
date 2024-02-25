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
import { DeleteQuestionCommentsUseCase } from '~/domain/forum/application/use-cases/comment-question/delete-question-comment'

import { CurrentUser } from '~/infra/auth/current-user-decorator'
import { UserPayload } from '~/infra/auth/jwt.strategy'

@Controller('/questions/comments/:questionCommentId')
export class DeleteQuestionCommentController {
  constructor(
    private readonly deleteQuestionComment: DeleteQuestionCommentsUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('questionCommentId') questionCommentId: string,
  ) {
    const { sub: userId } = user

    const result = await this.deleteQuestionComment.execute({
      questionCommentId,
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
