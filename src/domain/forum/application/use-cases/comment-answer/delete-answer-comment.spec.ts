import { expect } from 'vitest'

import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { NotAllowedError } from '~/core/errors/not-allowed-error'

import { DeleteAnswerCommentsUseCase } from '~/domain/forum/application/use-cases/comment-answer/delete-answer-comment'

import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
// SUT: System under test
let sut: DeleteAnswerCommentsUseCase
describe('Delete Answer Comment Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new DeleteAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })
  it('should be able to delete a answer comment', async () => {
    // Prepare
    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('bruce-bennet'),
      },
      new UniqueEntityID('answer-comment-x'),
    )

    await inMemoryAnswerCommentsRepository.create(newAnswerComment)

    // Act
    await sut.execute({
      answerCommentId: 'answer-comment-x',
      authorId: 'bruce-bennet',
    })

    // Assert
    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer, from another author', async () => {
    // Prepare
    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('bruce-bennet'),
      },
      new UniqueEntityID('answer-comment-x'),
    )

    await inMemoryAnswerCommentsRepository.create(newAnswerComment)

    const result = await sut.execute({
      answerCommentId: 'answer-comment-x',
      authorId: 'iron-man',
    })

    // Act
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
