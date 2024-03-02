import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { QuestionAttachment } from '~/domain/forum/enterprise/entities/question-attachment'

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error('Invalid Attachment type.')
    }

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        questionId: new UniqueEntityID(raw.questionId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdateMany(
    attachments: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = attachments.map((attachments) =>
      attachments.attachmentId.toString(),
    )

    return {
      where: {
        id: { in: attachmentsIds },
      },
      data: {
        questionId: attachments[0].questionId.toString(),
      },
    }
  }
}
