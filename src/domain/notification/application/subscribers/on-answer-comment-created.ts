import { DomainEvents } from '~/core/events/domain-events'
import { EventHandler } from '~/core/events/event-handler'
import { AnswersRepository } from '~/domain/forum/application/repositories/answers-repository'
import { AnswerCommentCreatedEvent } from '~/domain/forum/enterprise/events/answer-comment-created-event'
import { SendNotificationUseCase } from '~/domain/notification/application/use-cases/send-notification'

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answerRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this),
      AnswerCommentCreatedEvent.name,
    )
  }

  private async sendNewAnswerCommentNotification({
    answerComment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answerRepository.findById(
      answerComment.answerId.toString(),
    )

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `New Comment to your answer "${answer.excerpt
          .substring(0, 20)
          .concat('...')}"`,
        content: answer.excerpt,
      })
    }
  }
}
