import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { GetQuestionBySlugUseCase } from '~/domain/forum/application/use-cases/question/get-question-by-slug'

import { QuestionPresenter } from '~/infra/http/presenters/question.presenter'

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private readonly getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlug.execute({ slug })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const { question } = result.value
    return { question: QuestionPresenter.toHTTP(question) }
  }
}
