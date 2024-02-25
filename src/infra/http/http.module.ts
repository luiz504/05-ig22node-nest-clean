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

// Providers
import { CreateQuestionUseCase } from '~/domain/forum/application/use-cases/question/create-question'
import { FetchRecentQuestionsUseCase } from '~/domain/forum/application/use-cases/question/fetch-recent-questions'
import { AuthenticateStudentUseCase } from '~/domain/forum/application/use-cases/account/authenticate-student'
import { RegisterStudentUseCase } from '~/domain/forum/application/use-cases/account/register-student'
import { GetQuestionBySlugUseCase } from '~/domain/forum/application/use-cases/question/get-question-by-slug'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
  ],
  providers: [
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    GetQuestionBySlugUseCase,
  ],
})
export class HTTPModule {}
