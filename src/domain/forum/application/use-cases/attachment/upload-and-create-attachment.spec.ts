import { UploadAndCreateAttachmentUseCase } from '~/domain/forum/application/use-cases/attachment/upload-and-create-attachment'
import { InvalidAttachmentTypeError } from '~/domain/forum/application/use-cases/errors/invalid-attachment-type'

import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { FakeUploader } from 'test/storage/fake-uploader'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader
// SUT: System under test
let sut: UploadAndCreateAttachmentUseCase
describe('Upload and Create Attachment Use Case', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    )
  })
  it('should be able to upload and create an attachment', async () => {
    // Act
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from('some-image'),
    })

    // Assert
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0].fileName).toEqual('profile.png')
  })

  it('should be able to upload an attachment with an invalid file type', async () => {
    // Act
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    // Assert
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
