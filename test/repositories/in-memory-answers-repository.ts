import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { DomainEvents } from '~/core/events/domain-events'
import { PaginationParams } from '~/core/repositories/pagination-params'
import { AnswersRepository } from '~/domain/forum/application/repositories/answers-repository'
import { Answer } from '~/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer) {
    this.items.push(answer)

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id)

    if (!answer) return null

    return answer
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items[itemIndex] = answer
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items.splice(itemIndex, 1)
    await this.inMemoryAnswerAttachmentsRepository.deleteManyByAnswerId(
      answer.id.toString(),
    )
  }
}
