import { Injectable } from '@nestjs/common'

import { PaginationParams } from '~/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '~/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '~/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '~/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { PrismaCommentWithAuthorMapper } from '~/infra/database/prisma/mappers/prisma-comment-with-author-mapper'
import { PrismaQuestionCommentMapper } from '~/infra/database/prisma/mappers/prisma-question-comment-mapper'

import { PrismaService } from '~/infra/database/prisma/prisma.service'
@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.prisma.comment.findUnique({
      where: { id },
    })

    if (!questionComment) return null

    return PrismaQuestionCommentMapper.toDomain(questionComment)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const perPage = 20
    const questionsComments = await this.prisma.comment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return questionsComments.map(PrismaQuestionCommentMapper.toDomain)
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const perPage = 20
    const questionsComments = await this.prisma.comment.findMany({
      where: {
        questionId,
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

    return questionsComments.map(PrismaCommentWithAuthorMapper.toDomain)
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPersistance(questionComment)

    await this.prisma.comment.create({ data })
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: questionComment.id.toString() },
    })
  }
}
