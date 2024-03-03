import { QuestionDetails } from '~/domain/forum/enterprise/entities/value-objects/question-details'
import { AttachmentPresenter } from '~/infra/http/presenters/attachment-presenter'

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      authorId: questionDetails.authorId.toString(),
      bestAnswerId: questionDetails.bestAnswerId?.toString() || null,
      authorName: questionDetails.authorName,
      title: questionDetails.title,
      content: questionDetails.content,
      slug: questionDetails.slug.value,
      attachments: questionDetails.attachments.map(AttachmentPresenter.toHTTP),
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    }
  }
}
