import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
// SUT: System under test
let sut: FetchQuestionCommentsUseCase
describe('Fetch QuestionComments By QuestionCommentsId Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })
  it('should be to fetch question comments from a question', async () => {
    // Prepare
    const questionId = 'some-question-id'
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID(questionId) }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID(questionId) }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID(questionId) }),
    )

    // Act
    const result = await sut.execute({
      questionId: 'some-question-id',
      page: 1,
    })

    // Assert
    expect(result.value?.questionComments).toHaveLength(3)
  })
  it('should be to fetch question paginated question comments', async () => {
    // Prepare
    const questionId = 'some-question-id'

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityID(questionId) }),
      )
    }

    // Act
    const result = await sut.execute({ questionId, page: 2 })

    // Assert
    expect(result.value?.questionComments).toHaveLength(2)
  })
})
