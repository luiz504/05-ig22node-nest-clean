import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { makeQuestion } from 'test/factories/make-question'

import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { EditQuestionUseCase } from '../question/edit-question'
import { NotAllowedError } from '~/core/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

// SUT: System under test
let sut: EditQuestionUseCase
describe('Edit Question Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    )
  })
  it('should be able to edit a question title and description', async () => {
    // Prepare
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('bruce-bennet'),
      },
      new UniqueEntityID('question-x'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)
    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    // Act
    await sut.execute({
      questionId: 'question-x',
      authorId: 'bruce-bennet',
      title: 'New Question Title',
      content: 'New Question Content',
      attachmentIds: ['1', '3'],
    })

    // Assert
    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'New Question Title',
      content: 'New Question Content',
    })
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a question, from another author', async () => {
    // Prepare
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('bruce-bennet'),
      },
      new UniqueEntityID('question-x'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    // Act
    const result = await sut.execute({
      questionId: 'question-x',
      authorId: 'iron-man',
      title: 'New Question Title',
      content: 'New Question Content',
      attachmentIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
