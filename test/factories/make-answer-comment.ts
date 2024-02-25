import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '~/core/entities/unique-entity-id'

import {
  AnswerComment,
  AnswerCommentProps,
} from '~/domain/forum/enterprise/entities/answer-comment'

import { PrismaAnswerCommentMapper } from '~/infra/database/prisma/mappers/prisma-answer-comment-mapper'
import { PrismaService } from '~/infra/database/prisma/prisma.service'

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
) {
  const newAnswerComment = AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return newAnswerComment
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerComment(
    data: Partial<AnswerCommentProps> = {},
  ): Promise<AnswerComment> {
    const AnswerComment = makeAnswerComment(data)

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPersistance(AnswerComment),
    })

    return AnswerComment
  }
}
