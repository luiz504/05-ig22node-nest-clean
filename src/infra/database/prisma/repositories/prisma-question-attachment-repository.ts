import { Injectable } from '@nestjs/common'

import { QuestionAttachmentsRepository } from '~/domain/forum/application/repositories/question-attachment-repository'
import { QuestionAttachment } from '~/domain/forum/enterprise/entities/question-attachment'

import { PrismaQuestionAttachmentMapper } from '~/infra/database/prisma/mappers/prisma-question-attachment-mapper'
import { PrismaService } from '~/infra/database/prisma/prisma.service'
@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = await this.prisma.attachment.findMany({
      where: { questionId },
    })

    return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain)
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({ where: { questionId } })
  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return
    const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return

    const attachmentsIds = attachments.map((attachments) =>
      attachments.id.toString(),
    )
    await this.prisma.attachment.deleteMany({
      where: { id: { in: attachmentsIds } },
    })
    throw new Error('Method not implemented.')
  }
}
