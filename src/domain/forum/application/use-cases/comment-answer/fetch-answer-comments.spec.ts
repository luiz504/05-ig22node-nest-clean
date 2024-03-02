import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentRepository: InMemoryStudentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
// SUT: System under test
let sut: FetchAnswerCommentsUseCase
describe('Fetch AnswerComments By AnswerCommentsId Use Case', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })
  it('should be to fetch comments from a answer', async () => {
    // Prepare
    const user = makeStudent({ name: 'John Doe' })
    inMemoryStudentRepository.items.push(user)
    const answerId = 'some-answer-id'

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID(answerId),
      authorId: user.id,
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID(answerId),
      authorId: user.id,
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID(answerId),
      authorId: user.id,
    })

    await inMemoryAnswerCommentsRepository.create(comment1)
    await inMemoryAnswerCommentsRepository.create(comment2)
    await inMemoryAnswerCommentsRepository.create(comment3)

    // Act
    const result = await sut.execute({
      answerId: 'some-answer-id',
      page: 1,
    })
    const comments = result.value?.comments
    // Assert
    expect(comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          commentId: comment1.id,
          authorName: 'John Doe',
        }),
        expect.objectContaining({
          commentId: comment2.id,
          authorName: 'John Doe',
        }),
        expect.objectContaining({
          commentId: comment3.id,
          authorName: 'John Doe',
        }),
      ]),
    )
  })
  it('should be to fetch answer paginated answer comments', async () => {
    // Prepare
    const user = makeStudent({ name: 'John Doe' })
    inMemoryStudentRepository.items.push(user)
    const answerId = 'some-answer-id'

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID(answerId),
          authorId: user.id,
        }),
      )
    }

    // Act
    const result = await sut.execute({ answerId, page: 2 })
    const comment = result.value?.comments

    // Assert
    expect(comment).toHaveLength(2)
  })
})
