import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentRepository: InMemoryStudentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
// SUT: System under test
let sut: FetchQuestionCommentsUseCase
describe('Fetch QuestionComments By QuestionCommentsId Use Case', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentRepository,
    )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })
  it('should be to fetch question comments from a question', async () => {
    // Prepare
    const student = makeStudent({ name: 'John Doe' })
    const questionId = 'some-question-id'
    inMemoryStudentRepository.items.push(student)
    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID(questionId),
      authorId: student.id,
    })
    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID(questionId),
      authorId: student.id,
    })
    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID(questionId),
      authorId: student.id,
    })

    await inMemoryQuestionCommentsRepository.create(comment1)
    await inMemoryQuestionCommentsRepository.create(comment2)
    await inMemoryQuestionCommentsRepository.create(comment3)

    // Act
    const result = await sut.execute({
      questionId: 'some-question-id',
      page: 1,
    })

    // Assert
    expect(result.value?.comments).toHaveLength(3)
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
  it('should be to fetch question paginated question comments', async () => {
    // Prepare
    const questionId = 'some-question-id'
    const student = makeStudent()
    inMemoryStudentRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID(questionId),
          authorId: student.id,
        }),
      )
    }

    // Act
    const result = await sut.execute({ questionId, page: 2 })

    // Assert
    expect(result.value?.comments).toHaveLength(2)
  })
})
