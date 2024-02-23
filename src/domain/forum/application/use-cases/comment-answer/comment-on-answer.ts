import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { AnswerComment } from '~/domain/forum/enterprise/entities/answer-comment'
import { Either, left, right } from '~/core/either'
import { ResourceNotFoundError } from '~/core/errors/resource-not-found-error'
import { AnswersRepository } from '~/domain/forum/application/repositories/answers-repository'
import { AnswerCommentsRepository } from '~/domain/forum/application/repositories/answer-comments.repository'

interface CommentOnAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}
type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment
  }
>

export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      content,
    })

    await this.answerCommentsRepository.create(answerComment)

    return right({ answerComment })
  }
}
