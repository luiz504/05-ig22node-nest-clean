import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from '../question/get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '~/domain/forum/enterprise/entities/value-objects/slug'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
// SUT: System under test
let sut: GetQuestionBySlugUseCase
describe('Get Question by Slug Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })
  it('should be get a question by Slug', async () => {
    // Prepare
    const newQuestion = makeQuestion({ slug: Slug.create('example-question') })

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
})
