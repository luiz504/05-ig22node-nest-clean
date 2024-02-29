import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '~/core/entities/unique-entity-id'

import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '~/domain/forum/enterprise/entities/question-attachment'

import { PrismaService } from '~/infra/database/prisma/prisma.service'

export function makeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const newQuestionAttachment = QuestionAttachment.create(
    {
      questionId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return newQuestionAttachment
}
@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(
    data: Partial<QuestionAttachmentProps> = {},
  ): Promise<QuestionAttachment> {
    const questionAttachment = makeQuestionAttachment(data)

    await this.prisma.attachment.update({
      where: { id: questionAttachment.attachmentId.toString() },
      data: {
        questionId: questionAttachment.questionId.toString(),
      },
    })

    return questionAttachment
  }
}
