import { Slug } from '~/domain/forum/enterprise/entities/value-objects/slug'

import { GetQuestionBySlugUseCase } from '~/domain/forum/application/use-cases/question/get-question-by-slug'

import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeStudent } from 'test/factories/make-student'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentRepository: InMemoryAttachmentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
// SUT: System under test
let sut: GetQuestionBySlugUseCase
describe('Get Question by Slug Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAttachmentRepository = new InMemoryAttachmentsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryStudentsRepository,
      inMemoryAttachmentRepository,
    )
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })
  it('should be get a question by Slug', async () => {
    // Prepare
    const user = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.items.push(user)
    const newQuestion = makeQuestion({
      authorId: user.id,
      slug: Slug.create('example-question'),
    })

    await inMemoryQuestionsRepository.create(newQuestion)

    // Act
    const result = await sut.execute({
      slug: 'example-question',
    })

    // Assert
    expect(result.isRight()).toBe(true)
    const { question } = result.value as any //eslint-disable-line 

    expect(result.value).toEqual(
      expect.objectContaining({
        question: expect.objectContaining({ title: newQuestion.title }),
      }),
    )
  })
  it('should be get a question with attachments by Slug', async () => {
    // Prepare
    const user = makeStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(user)

    const newQuestion = makeQuestion({
      authorId: user.id,
      slug: Slug.create('example-question'),
    })

    await inMemoryQuestionsRepository.create(newQuestion)
    const attachment = makeAttachment({ title: 'attachment1' })

    inMemoryAttachmentRepository.items.push(attachment)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: attachment.id,
      }),
    )

    // Act
    const result = await sut.execute({
      slug: 'example-question',
    })

    // Assert
    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual(
      expect.objectContaining({
        question: expect.objectContaining({
          title: newQuestion.title,
          authorName: 'John Doe',
          attachments: expect.arrayContaining([
            expect.objectContaining({ title: attachment.title }),
          ]),
        }),
      }),
    )
  })
})
