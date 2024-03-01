import { Injectable } from '@nestjs/common'

import { Either, left, right } from '~/core/either'
import { ResourceNotFoundError } from '~/core/errors/resource-not-found-error'

import { QuestionsRepository } from '~/domain/forum/application/repositories/question-repository'
import { QuestionDetails } from '~/domain/forum/enterprise/entities/value-objects/question-details'

interface GetQuestionBySlugUseCaseRequest {
  slug: string
}
type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: QuestionDetails
  }
>
@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionRepository.findDetailsBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({ question })
  }
}
