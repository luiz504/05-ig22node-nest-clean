import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import {
  QuestionComment,
  QuestionCommentProps,
} from '~/domain/forum/enterprise/entities/question-comment'

import { PrismaQuestionCommentMapper } from '~/infra/database/prisma/mappers/prisma-question-comment-mapper'
import { PrismaService } from '~/infra/database/prisma/prisma.service'

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID,
) {
  const newQuestionComment = QuestionComment.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return newQuestionComment
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionComment(
    data: Partial<QuestionCommentProps> = {},
  ): Promise<QuestionComment> {
    const questionComment = makeQuestionComment(data)

    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPersistance(questionComment),
    })

    return questionComment
  }
}
