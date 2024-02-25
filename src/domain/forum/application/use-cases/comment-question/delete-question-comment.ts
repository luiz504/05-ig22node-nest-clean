import { Injectable } from '@nestjs/common'

import { Either, left, right } from '~/core/either'
import { ResourceNotFoundError } from '~/core/errors/resource-not-found-error'
import { NotAllowedError } from '~/core/errors/not-allowed-error'

import { QuestionCommentsRepository } from '~/domain/forum/application/repositories/question-comments-repository'

interface DeleteQuestionCommentsUseCaseRequest {
  questionCommentId: string
  authorId: string
}
type DeleteQuestionCommentsUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>
@Injectable()
export class DeleteQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionCommentId,
    authorId,
  }: DeleteQuestionCommentsUseCaseRequest): Promise<DeleteQuestionCommentsUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== questionComment.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.questionCommentsRepository.delete(questionComment)

    return right(null)
  }
}
