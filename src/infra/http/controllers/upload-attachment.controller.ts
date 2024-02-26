import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

const MAX_FILE_SIZE = 1024 * 1024 * 2 // 2mb
const fileValidationPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
    new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
  ],
})
@Controller('/attachments')
export class UploadAttachmentController {
  //   constructor(private uploadAttachment: any) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(@UploadedFile(fileValidationPipe) file: Express.Multer.File) {
    console.log('file', file) //eslint-disable-line
  }
}
