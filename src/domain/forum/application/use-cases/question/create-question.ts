import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { Either, right } from '~/core/either'

import { Question } from '~/domain/forum/enterprise/entities/question'
import { QuestionAttachment } from '~/domain/forum/enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '~/domain/forum/enterprise/entities/question-attachment-list'
import { QuestionsRepository } from '~/domain/forum/application/repositories/question-repository'

interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>
@Injectable()
export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    })

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
    })

    question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionRepository.create(question)

    return right({ question })
  }
}
