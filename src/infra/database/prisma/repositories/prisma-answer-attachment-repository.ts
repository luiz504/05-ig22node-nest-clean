import { Injectable } from '@nestjs/common'

import { AnswerAttachmentsRepository } from '~/domain/forum/application/repositories/answer-attachment-repository'
import { AnswerAttachment } from '~/domain/forum/enterprise/entities/answer-attachment'

import { PrismaAnswerAttachmentMapper } from '~/infra/database/prisma/mappers/prisma-answer-attachment-mapper'
import { PrismaService } from '~/infra/database/prisma/prisma.service'
@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = await this.prisma.attachment.findMany({
      where: { answerId },
    })

    return answerAttachments.map(PrismaAnswerAttachmentMapper.toDomain)
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({ where: { answerId } })
  }
}
