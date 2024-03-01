import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { ValueObject } from '~/core/entities/value-object'
import { Attachment } from '~/domain/forum/enterprise/entities/attachment'

import { Slug } from '~/domain/forum/enterprise/entities/value-objects/slug'

export interface QuestionDetailsProps {
  questionId: UniqueEntityID
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID | null
  authorName: string
  title: string
  slug: Slug
  content: string
  attachments: Attachment[]
  createdAt: Date
  updatedAt?: Date | null
}
export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get questionId() {
    return this.props.questionId
  }

  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get authorName() {
    return this.props.authorName
  }

  get title() {
    return this.props.title
  }

  get slug() {
    return this.props.slug
  }

  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props)
  }
}
