import { Injectable } from '@nestjs/common'

import { Either, left, right } from '~/core/either'

import { InvalidAttachmentTypeError } from '~/domain/forum/application/use-cases/errors/invalid-attachment-type'
import { Attachment } from '~/domain/forum/enterprise/entities/attachment'
import { AttachmentsRepository } from '~/domain/forum/application/repositories/attachment-repository'
import { Uploader } from '~/domain/forum/application/storage/upload'

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment
  }
>
@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileType,
    fileName,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!/^image\/(jpeg|png)$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body })
    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentRepository.create(attachment)

    return right({ attachment })
  }
}
