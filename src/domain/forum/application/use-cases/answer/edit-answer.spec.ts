import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { makeAnswer } from 'test/factories/make-answer'

import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { EditAnswerUseCase } from '../answer/edit-answer'
import { NotAllowedError } from '~/core/errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

// SUT: System under test
let sut: EditAnswerUseCase
describe('Edit Answer Use Case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    )
  })
  it('should be able to edit a answer title and description', async () => {
    // Prepare
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('bruce-bennet'),
      },
      new UniqueEntityID('answer-x'),
    )

    await inMemoryAnswersRepository.create(newAnswer)
    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    // Act
    await sut.execute({
      answerId: 'answer-x',
      authorId: 'bruce-bennet',
      content: 'New Answer Content',
      attachmentIds: ['1', '3'],
    })

    // Assert
    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'New Answer Content',
    })
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
      ],
    )
  })

  it('should not be able to edit a answer, from another author', async () => {
    // Prepare
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('bruce-bennet'),
      },
      new UniqueEntityID('answer-x'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    // Act
    const result = await sut.execute({
      answerId: 'answer-x',
      authorId: 'iron-man',
      content: 'New Answer Content',
      attachmentIds: [],
    })

    // Assert
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
