import { Module } from '@nestjs/common'

// domain
import { QuestionsRepository } from '~/domain/forum/application/repositories/question-repository'
import { StudentsRepository } from '~/domain/forum/application/repositories/students-repository'

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
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    StudentsRepository,
    QuestionsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
  ],
})
export class DatabaseModule {}
