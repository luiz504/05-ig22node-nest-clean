import { Injectable } from '@nestjs/common'

import { AttachmentsRepository } from '~/domain/forum/application/repositories/attachment-repository'
import { Attachment } from '~/domain/forum/enterprise/entities/attachment'
import { PrismaAttachmentMapper } from '~/infra/database/prisma/mappers/prisma-attachment-mapper'

import { PrismaService } from '~/infra/database/prisma/prisma.service'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPersistance(attachment)
    await this.prisma.attachment.create({ data })
  }
}
