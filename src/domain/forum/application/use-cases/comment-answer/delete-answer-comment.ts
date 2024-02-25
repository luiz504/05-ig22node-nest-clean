import { Injectable } from '@nestjs/common'

import { Either, left, right } from '~/core/either'
import { NotAllowedError } from '~/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '~/core/errors/resource-not-found-error'

import { AnswerCommentsRepository } from '~/domain/forum/application/repositories/answer-comments.repository'

interface DeleteAnswerCommentsUseCaseRequest {
  answerCommentId: string
  authorId: string
}
type DeleteAnswerCommentsUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>
@Injectable()
export class DeleteAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerCommentId,
    authorId,
  }: DeleteAnswerCommentsUseCaseRequest): Promise<DeleteAnswerCommentsUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answerComment.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.answerCommentsRepository.delete(answerComment)

    return right(null)
  }
}
