import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { CommentOnAnswerUseCase } from '../comment-answer/comment-on-answer'

import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { ResourceNotFoundError } from '~/core/errors/resource-not-found-error'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
// SUT: System under test
let sut: CommentOnAnswerUseCase
describe('Comment On Answer Use Case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })
  it('should be able to comment on a answer', async () => {
    // Prepare
    const answer = makeAnswer()
    await inMemoryAnswersRepository.create(answer)

    const data = {
      content: 'Some content',
    }

    // Act
    const result = await sut.execute({
      authorId: 'some-author-id',
      answerId: answer.id.toString(),
      ...data,
    })

    // Assert
    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      data.content,
    )
  })

  it('should not be able to comment on a inexistent answer', async () => {
    const data = {
      content: 'Some content',
    }

    // Act
    const result = await sut.execute({
      authorId: 'some-author-id',
      answerId: 'inexistent-answer',
      ...data,
    })

    // Assert
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
