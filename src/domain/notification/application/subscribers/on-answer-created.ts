import { Injectable } from '@nestjs/common'

import { DomainEvents } from '~/core/events/domain-events'
import { EventHandler } from '~/core/events/event-handler'

import { QuestionsRepository } from '~/domain/forum/application/repositories/question-repository'
import { AnswerCreatedEvent } from '~/domain/forum/enterprise/events/answer-created-event'
import { SendNotificationUseCase } from '~/domain/notification/application/use-cases/send-notification'

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    )
    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `New Answer at "${question.title
          .substring(0, 40)
          .concat('...')}"`,
        content: answer.excerpt,
      })
    }
  }
}
