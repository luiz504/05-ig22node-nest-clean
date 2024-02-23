import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
// SUT: System under test
let sut: FetchAnswerCommentsUseCase
describe('Fetch AnswerComments By AnswerCommentsId Use Case', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })
  it('should be to fetch comments from a answer', async () => {
    // Prepare
    const answerId = 'some-answer-id'
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID(answerId) }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID(answerId) }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID(answerId) }),
    )

    // Act
    const result = await sut.execute({
      answerId: 'some-answer-id',
      page: 1,
    })
    const answerComments = result.value?.answerComments
    // Assert
    expect(answerComments).toHaveLength(3)
  })
  it('should be to fetch answer paginated answer comments', async () => {
    // Prepare
    const answerId = 'some-answer-id'

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID(answerId) }),
      )
    }

    // Act
    const result = await sut.execute({ answerId, page: 2 })
    const answerComments = result.value?.answerComments

    // Assert
    expect(answerComments).toHaveLength(2)
  })
})
