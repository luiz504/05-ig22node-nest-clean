import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'

import { GetQuestionBySlugUseCase } from '~/domain/forum/application/use-cases/question/get-question-by-slug'

import { QuestionDetailsPresenter } from '~/infra/http/presenters/question-details-presenter'

const fetchRecentQuestionsResponseSchema = z.object({
  question: z.object({
    questionId: z.string().uuid(),
    authorId: z.string().uuid(),
    bestAnswerId: z.string().uuid().optional().nullable(),
    title: z.string(),
    content: z.string(),
    slug: z.string(),
    authorName: z.string(),
    attachments: z.array(
      z.object({
        id: z.string().uuid(),
        url: z.string().url(),
        title: z.string(),
      }),
    ),
    createdAt: z.date(),
    updatedAt: z.date().optional().nullable(),
  }),
})

type Response = z.infer<typeof fetchRecentQuestionsResponseSchema>

@ApiTags('Questions')
@ApiBearerAuth()
@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private readonly getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @ApiParam({ name: 'slug' })
  @ApiResponse({
    status: 200,
    schema: zodToOpenAPI(fetchRecentQuestionsResponseSchema),
  })
  @Get()
  async handle(@Param('slug') slug: string): Promise<Response> {
    const result = await this.getQuestionBySlug.execute({ slug })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const { question } = result.value
    return { question: QuestionDetailsPresenter.toHTTP(question) }
  }
}
