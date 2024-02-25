import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { FetchQuestionCommentsUseCase } from '~/domain/forum/application/use-cases/comment-question/fetch-question-comments'

import { ZodValidationPipe } from '~/infra/http/pipes/zod-validation.pipe'
import { CommentPresenter } from '~/infra/http/presenters/comment.presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(
    private readonly fetchQuestionComments: FetchQuestionCommentsUseCase,
  ) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionComments.execute({
      questionId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const { questionComments } = result.value

    return { comments: questionComments.map(CommentPresenter.toHTTP) }
  }
}
