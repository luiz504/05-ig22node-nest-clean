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
}
