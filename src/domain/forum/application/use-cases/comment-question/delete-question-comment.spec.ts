import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { NotAllowedError } from '~/core/errors/not-allowed-error'
import { DeleteQuestionCommentsUseCase } from '~/domain/forum/application/use-cases/comment-question/delete-question-comment'

import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
// SUT: System under test
let sut: DeleteQuestionCommentsUseCase
describe('Delete Question Comment Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })
  it('should be able to delete a question comment', async () => {
    // Prepare
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('bruce-bennet'),
      },
      new UniqueEntityID('question-comment-x'),
    )

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    // Act
    await sut.execute({
      questionCommentId: 'question-comment-x',
      authorId: 'bruce-bennet',
    })

    // Assert
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question, from another author', async () => {
    // Prepare
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('bruce-bennet'),
      },
      new UniqueEntityID('question-comment-x'),
    )

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    // Act
    const result = await sut.execute({
      questionCommentId: 'question-comment-x',
      authorId: 'iron-man',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
