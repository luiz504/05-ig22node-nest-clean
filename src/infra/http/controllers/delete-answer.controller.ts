import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common'
import { NotAllowedError } from '~/core/errors/not-allowed-error'

import { DeleteAnswerUseCase } from '~/domain/forum/application/use-cases/answer/delete-answer'

import { CurrentUser } from '~/infra/auth/current-user-decorator'
import { UserPayload } from '~/infra/auth/jwt.strategy'

@Controller('/answers/:answerId')
export class DeleteAnswerController {
  constructor(private readonly deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const { sub: userId } = user

    const result = await this.deleteAnswer.execute({
      answerId,
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
