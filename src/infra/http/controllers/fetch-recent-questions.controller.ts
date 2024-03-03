import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'

import { FetchRecentQuestionsUseCase } from '~/domain/forum/application/use-cases/question/fetch-recent-questions'

import { ZodValidationPipe } from '~/infra/http/pipes/zod-validation.pipe'
import { QuestionPresenter } from '~/infra/http/presenters/question-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const fetchRecentQuestionsResponseSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string().uuid(),
      title: z.string(),
      slug: z.string(),
      bestAnswerId: z.string().uuid().optional().nullable(),
      createdAt: z.date(),
      updatedAt: z.date().optional().nullable(),
    }),
  ),
})

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

type Response = z.infer<typeof fetchRecentQuestionsResponseSchema>

@ApiTags('Questions')
@ApiBearerAuth()
@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(
    private readonly fetchRecentQuestions: FetchRecentQuestionsUseCase,
  ) {}

  @ApiOperation({
    description: 'Fetch the most recent questions, 20 items per page',
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiResponse({
    status: 200,
    schema: zodToOpenAPI(fetchRecentQuestionsResponseSchema),
  })
  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ): Promise<Response> {
    const result = await this.fetchRecentQuestions.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { questions } = result.value

    return { questions: questions.map(QuestionPresenter.toHTTP) }
  }
}
