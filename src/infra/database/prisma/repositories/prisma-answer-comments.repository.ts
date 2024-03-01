import { Injectable } from '@nestjs/common'

import { PaginationParams } from '~/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '~/domain/forum/application/repositories/answer-comments.repository'

import { AnswerComment } from '~/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '~/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { PrismaAnswerCommentMapper } from '~/infra/database/prisma/mappers/prisma-answer-comment-mapper'
import { PrismaCommentWithAuthorMapper } from '~/infra/database/prisma/mappers/prisma-comment-with-author-mapper'

import { PrismaService } from '~/infra/database/prisma/prisma.service'
@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prisma.comment.findUnique({
      where: { id },
    })

    if (!answerComment) return null

    return PrismaAnswerCommentMapper.toDomain(answerComment)
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const perPage = 20
    const answersComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return answersComments.map(PrismaAnswerCommentMapper.toDomain)
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const perPage = 20
    const answersComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return answersComments.map(PrismaCommentWithAuthorMapper.toDomain)
  }

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPersistance(answerComment)

    await this.prisma.comment.create({ data })
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: answerComment.id.toString() },
    })
  }
}
