import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { UploadAndCreateAttachmentUseCase } from '~/domain/forum/application/use-cases/attachment/upload-and-create-attachment'
import { InvalidAttachmentTypeError } from '~/domain/forum/application/use-cases/errors/invalid-attachment-type'

const MAX_FILE_SIZE = 1024 * 1024 * 2 // 2mb
const fileValidationPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
    new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
  ],
})
@Controller('/attachments')
export class UploadAttachmentController {
  constructor(
    private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(@UploadedFile(fileValidationPipe) file: Express.Multer.File) {
    console.log('file', file)
    try {
      const result = await this.uploadAndCreateAttachment.execute({
        fileName: file.originalname,
        fileType: file.mimetype,
        body: file.buffer,
      })

      if (result.isLeft()) {
        const error = result.value
        console.log('eee =>', error)

        switch (error.constructor) {
          case InvalidAttachmentTypeError:
            throw new UnsupportedMediaTypeException(error.message)
          default:
            throw new BadRequestException(error.message)
        }
      }
      const { attachment } = result.value

      return {
        attachmentId: attachment.id.toString(),
      }
    } catch (err) {
      console.log('err', err)
      throw new BadRequestException(err)
    }
  }
}
