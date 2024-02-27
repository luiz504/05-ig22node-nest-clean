import { randomUUID } from 'node:crypto'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'

import {
  UploadParams,
  Uploader,
} from '~/domain/forum/application/storage/upload'

import { EnvService } from '~/infra/env/env.service'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private readonly envService: EnvService) {
    const accountId = envService.get('AWS_ACCESS_KEY_ID')
    const accessKeyId = envService.get('AWS_ACCESS_KEY_ID')
    const secretAccessKey = envService.get('AWS_SECRET_ACCESS_KEY')

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      maxAttempts: 5,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return { url: uniqueFileName }
  }
}
