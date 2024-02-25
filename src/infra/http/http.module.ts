import { Module } from '@nestjs/common'

// Modules
import { CryptographyModule } from '~/infra/cryptography/cryptography.module'
import { DatabaseModule } from '~/infra/database/database.module'

// Controllers
import { AuthenticateController } from '~/infra/http/controllers/authenticate.controller'
import { CreateAccountController } from '~/infra/http/controllers/create-account.controller'
import { CreateQuestionController } from '~/infra/http/controllers/create-question.controller'
import { FetchRecentQuestionsController } from '~/infra/http/controllers/fetch-recent-questions.controller'
import { GetQuestionBySlugController } from '~/infra/http/controllers/get-question-by-slug.controller'
import { EditQuestionController } from '~/infra/http/controllers/edit-question.controller'
import { DeleteQuestionController } from '~/infra/http/controllers/delete-question.controller'
import { AnswerQuestionController } from '~/infra/http/controllers/answer-question.controller'
import { EditAnswerController } from '~/infra/http/controllers/edit-answer.controller'

// Providers
import { CreateQuestionUseCase } from '~/domain/forum/application/use-cases/question/create-question'
import { FetchRecentQuestionsUseCase } from '~/domain/forum/application/use-cases/question/fetch-recent-questions'
import { AuthenticateStudentUseCase } from '~/domain/forum/application/use-cases/account/authenticate-student'
import { RegisterStudentUseCase } from '~/domain/forum/application/use-cases/account/register-student'
import { GetQuestionBySlugUseCase } from '~/domain/forum/application/use-cases/question/get-question-by-slug'
import { EditQuestionUseCase } from '~/domain/forum/application/use-cases/question/edit-question'
import { DeleteQuestionUseCase } from '~/domain/forum/application/use-cases/question/delete-question'
import { AnswerQuestionUseCase } from '~/domain/forum/application/use-cases/answer/answer-question'
import { EditAnswerUseCase } from '~/domain/forum/application/use-cases/answer/edit-answer'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
  ],
  providers: [
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
  ],
})
export class HTTPModule {}
