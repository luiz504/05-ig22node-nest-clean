import { ResourceNotFoundError } from '~/core/errors/resource-not-found-error'
import { CommentOnQuestionUseCase } from '~/domain/forum/application/use-cases/comment-question/comment-on-question'

import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentRepository: InMemoryAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
// SUT: System under test
let sut: CommentOnQuestionUseCase
describe('Comment On Question Use Case', () => {
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
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })
  it('should be able to comment on a question', async () => {
    // Prepare
    const question = makeQuestion()
    await inMemoryQuestionsRepository.create(question)

    const data = {
      content: 'Some content',
    }

    // Act
    const result = await sut.execute({
      authorId: 'some-author-id',
      questionId: question.id.toString(),
      ...data,
    })

    // Assert
    expect(result.isRight()).toBe(true)

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      data.content,
    )
  })
  it('should not be able to comment on a inexistent question', async () => {
    const data = {
      content: 'Some content',
    }

    // Act
    const result = await sut.execute({
      authorId: 'some-author-id',
      questionId: 'inexistent-answer',
      ...data,
    })

    // Assert
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
