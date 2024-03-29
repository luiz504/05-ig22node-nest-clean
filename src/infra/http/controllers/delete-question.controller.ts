import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common'
import { NotAllowedError } from '~/core/errors/not-allowed-error'

import { DeleteQuestionUseCase } from '~/domain/forum/application/use-cases/question/delete-question'

import { CurrentUser } from '~/infra/auth/current-user-decorator'
import { UserPayload } from '~/infra/auth/jwt.strategy'

@Controller('/questions/:questionId')
export class DeleteQuestionController {
  constructor(private readonly deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
  ) {
    const { sub: userId } = user

    const result = await this.deleteQuestion.execute({
      questionId,
      authorId: userId,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
