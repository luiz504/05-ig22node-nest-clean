import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'

import { FetchQuestionAnswersUseCase } from '~/domain/forum/application/use-cases/answer/fetch-question-answers'

import { ZodValidationPipe } from '~/infra/http/pipes/zod-validation.pipe'
import { AnswerPresenter } from '~/infra/http/presenters/answer-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(
    private readonly fetchQuestionAnswers: FetchQuestionAnswersUseCase,
  ) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionAnswers.execute({ questionId, page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const { answers } = result.value

    return { answers: answers.map(AnswerPresenter.toHTTP) }
  }
}
