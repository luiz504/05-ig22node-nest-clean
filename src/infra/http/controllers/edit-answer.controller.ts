import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'

import { NotAllowedError } from '~/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '~/core/errors/resource-not-found-error'

import { EditAnswerUseCase } from '~/domain/forum/application/use-cases/answer/edit-answer'

import { CurrentUser } from '~/infra/auth/current-user-decorator'
import { UserPayload } from '~/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '~/infra/http/pipes/zod-validation.pipe'

const editAnswerBodySchema = z.object({
  content: z.string().min(1),
})

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema)
@Controller('/answers/:answerId')
export class EditAnswerController {
  constructor(private readonly editAnswers: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const { content } = body

    const { sub: userId } = user

    const result = await this.editAnswers.execute({
      authorId: userId,
      answerId,
      content,
      attachmentIds: [],
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
