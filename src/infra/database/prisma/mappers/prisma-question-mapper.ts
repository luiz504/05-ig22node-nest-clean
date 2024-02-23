import { Question as PrismaQuestion } from '@prisma/client'
import { UniqueEntityID } from '~/core/entities/unique-entity-id'

import { Question } from '~/domain/forum/enterprise/entities/question'
import { Slug } from '~/domain/forum/enterprise/entities/value-objects/slug'

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        authorId: new UniqueEntityID(raw.authorId),
        title: raw.title,
        content: raw.content,
        slug: Slug.create(raw.slug),
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityID(raw.bestAnswerId)
          : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
