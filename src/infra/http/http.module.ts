import { Module } from '@nestjs/common'
// Modules
import { CryptographyModule } from '~/infra/cryptography/cryptography.module'
import { DatabaseModule } from '~/infra/database/database.module'

// Controllers
import { AuthenticateController } from '~/infra/http/controllers/authenticate.controller'
import { CreateAccountController } from '~/infra/http/controllers/create-account.controller'
import { CreateQuestionController } from '~/infra/http/controllers/create-question.controller'
import { FetchRecentQuestionsController } from '~/infra/http/controllers/fetch-recent-questions.controller'

// Providers
import { CreateQuestionUseCase } from '~/domain/forum/application/use-cases/question/create-question'
import { FetchRecentQuestionsUseCase } from '~/domain/forum/application/use-cases/question/fetch-recent-questions'
import { AuthenticateStudentUseCase } from '~/domain/forum/application/use-cases/account/authenticate-student'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    AuthenticateStudentUseCase,
  ],
})
export class HTTPModule {}
