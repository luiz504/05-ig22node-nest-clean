import { Either, left, right } from '~/core/either'
import { Answer } from '../../../enterprise/entities/answer'
import { AnswersRepository } from '../../repositories/answers-repository'
import { ResourceNotFoundError } from '~/core/errors/resource-not-found-error'
import { NotAllowedError } from '~/core/errors/not-allowed-error'
import { AnswerAttachmentsRepository } from '~/domain/forum/application/repositories/answer-attachment-repository'
import { AnswerAttachmentList } from '~/domain/forum/enterprise/entities/answer-attachment-list'
import { AnswerAttachment } from '~/domain/forum/enterprise/entities/answer-attachment'
import { UniqueEntityID } from '~/core/entities/unique-entity-id'

interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
  attachmentIds: string[]
}
type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>
export class EditAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )

    const answerAttachments = attachmentIds.map((attachmentsId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentsId),
        answerId: answer.id,
      })
    })

    answerAttachmentList.update(answerAttachments)

    answer.content = content
    answer.attachments = answerAttachmentList

    await this.answerRepository.save(answer)

    return right({ answer })
  }
}
