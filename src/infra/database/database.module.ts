import { Module } from '@nestjs/common'

// domain
import { QuestionsRepository } from '~/domain/forum/application/repositories/question-repository'
import { StudentsRepository } from '~/domain/forum/application/repositories/students-repository'
import { AnswerAttachmentsRepository } from '~/domain/forum/application/repositories/answer-attachment-repository'
import { AnswerCommentsRepository } from '~/domain/forum/application/repositories/answer-comments.repository'
import { AnswersRepository } from '~/domain/forum/application/repositories/answers-repository'
import { QuestionAttachmentsRepository } from '~/domain/forum/application/repositories/question-attachment-repository'
import { QuestionCommentsRepository } from '~/domain/forum/application/repositories/question-comments-repository'

// prisma
import { PrismaService } from '~/infra/database/prisma/prisma.service'
import { PrismaAnswerAttachmentsRepository } from '~/infra/database/prisma/repositories/prisma-answer-attachment-repository'
import { PrismaAnswerCommentsRepository } from '~/infra/database/prisma/repositories/prisma-answer-comments.repository'
import { PrismaAnswersRepository } from '~/infra/database/prisma/repositories/prisma-answers-repository'
import { PrismaQuestionAttachmentsRepository } from '~/infra/database/prisma/repositories/prisma-question-attachment-repository'
import { PrismaQuestionCommentsRepository } from '~/infra/database/prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionsRepository } from '~/infra/database/prisma/repositories/prisma-question-repository'
import { PrismaStudentsRepository } from '~/infra/database/prisma/repositories/prisma-students-repository'

// infra

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    { provide: AnswersRepository, useClass: PrismaAnswersRepository },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    StudentsRepository,
    QuestionsRepository,
    QuestionAttachmentsRepository,
    QuestionCommentsRepository,
    AnswersRepository,
    AnswerCommentsRepository,
    AnswerAttachmentsRepository,
  ],
})
export class DatabaseModule {}
