import { Either, left, right } from '~/core/either'
import { AnswerCommentsRepository } from '../../repositories/answer-comments.repository'
import { ResourceNotFoundError } from '../../../../../core/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../../core/errors/not-allowed-error'

interface DeleteAnswerCommentsUseCaseRequest {
  answerCommentId: string
  authorId: string
}
type DeleteAnswerCommentsUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>
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
