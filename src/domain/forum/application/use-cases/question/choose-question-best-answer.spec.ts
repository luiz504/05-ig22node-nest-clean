import { ChooseQuestionBestAnswerUseCase } from '~/domain/forum/application/use-cases/question/choose-question-best-answer'

import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { NotAllowedError } from '~/core/errors/not-allowed-error'

import { makeQuestion } from 'test/factories/make-question'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentRepository: InMemoryAttachmentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

// SUT: System under test
let sut: ChooseQuestionBestAnswerUseCase
describe('Choose Question best Answer Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAttachmentRepository = new InMemoryAttachmentsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryStudentsRepository,
      inMemoryAttachmentRepository,
    )
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })
  it('should be able to define a question best answer', async () => {
    // Prepare
    const newQuestion = makeQuestion()

    await inMemoryQuestionsRepository.create(newQuestion)

    const newAnswer = makeAnswer(
      {
        questionId: newQuestion.id,
        authorId: newQuestion.authorId,
      },
      new UniqueEntityID('answer-y'),
    )

    await inMemoryAnswersRepository.create(newAnswer)
    // Act
    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newQuestion.authorId.toString(),
    })

    // Assert
    expect(
      inMemoryQuestionsRepository.items[0].bestAnswerId?.toString(),
    ).toEqual('answer-y')
  })

  it('should not be able to choose a question best answer, from another author', async () => {
    // Prepare
    const newQuestion = makeQuestion()

    await inMemoryQuestionsRepository.create(newQuestion)

    const newAnswer = makeAnswer(
      {
        questionId: newQuestion.id,
        authorId: newQuestion.authorId,
      },
      new UniqueEntityID('answer-y'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    // Act
    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'iron-man',
    })

    // Assert
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
