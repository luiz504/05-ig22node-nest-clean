import { Either, left, right } from '~/core/either'
import { Injectable } from '@nestjs/common'

import { ResourceNotFoundError } from '~/core/errors/resource-not-found-error'
import { NotAllowedError } from '~/core/errors/not-allowed-error'

import { QuestionsRepository } from '~/domain/forum/application/repositories/question-repository'

interface DeleteQuestionUseCaseRequest {
  questionId: string
  authorId: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>
@Injectable()
export class DeleteQuestionUseCase {
  constructor(private questionRepository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.questionRepository.delete(question)
    return right(null)
  }
}
