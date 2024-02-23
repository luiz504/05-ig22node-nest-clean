import { ResourceNotFoundError } from '~/core/errors/resource-not-found-error'

import { Either, left, right } from '~/core/either'
import { NotAllowedError } from '~/core/errors/not-allowed-error'
import { Question } from '~/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '~/domain/forum/application/repositories/question-repository'
import { QuestionAttachmentList } from '~/domain/forum/enterprise/entities/question-attachment-list'
import { QuestionAttachmentsRepository } from '~/domain/forum/application/repositories/question-attachment-repository'
import { QuestionAttachment } from '~/domain/forum/enterprise/entities/question-attachment'
import { UniqueEntityID } from '~/core/entities/unique-entity-id'

interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )

    const questionAttachments = attachmentIds.map((attachmentIds) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentIds),
        questionId: question.id,
      })
    })

    questionAttachmentList.update(questionAttachments)

    question.title = title
    question.content = content
    question.attachments = questionAttachmentList

    await this.questionRepository.save(question)

    return right({ question })
  }
}
