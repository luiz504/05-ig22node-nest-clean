import { Module } from '@nestjs/common'

// Modules
import { CryptographyModule } from '~/infra/cryptography/cryptography.module'
import { DatabaseModule } from '~/infra/database/database.module'
import { StorageModule } from '~/infra/storage/storage.module'

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
import { DeleteAnswerController } from '~/infra/http/controllers/delete-answer.controller'
import { FetchQuestionAnswersController } from '~/infra/http/controllers/fetch-question-answers.controller'
import { ChooseQuestionBestAnswerController } from '~/infra/http/controllers/choose-question-best-asnwer.controller'
import { CommentOnQuestionController } from '~/infra/http/controllers/comment-on-question.controller'
import { DeleteQuestionCommentController } from '~/infra/http/controllers/delete-question-comment.controller'
import { CommentOnAnswerController } from '~/infra/http/controllers/comment-on-answer.controller'
import { DeleteAnswerCommentController } from '~/infra/http/controllers/delete-answer-comment.controller'
import { FetchQuestionCommentsController } from '~/infra/http/controllers/fetch-question-comments.controller'
import { FetchAnswerCommentsController } from '~/infra/http/controllers/fetch-answer-comments.controller'
import { UploadAttachmentController } from '~/infra/http/controllers/upload-attachment.controller'
import { ReadNotificationController } from '~/infra/http/controllers/read-notification.controller'

// Providers - UseCases
import { CreateQuestionUseCase } from '~/domain/forum/application/use-cases/question/create-question'
import { FetchRecentQuestionsUseCase } from '~/domain/forum/application/use-cases/question/fetch-recent-questions'
import { AuthenticateStudentUseCase } from '~/domain/forum/application/use-cases/account/authenticate-student'
import { RegisterStudentUseCase } from '~/domain/forum/application/use-cases/account/register-student'
import { GetQuestionBySlugUseCase } from '~/domain/forum/application/use-cases/question/get-question-by-slug'
import { EditQuestionUseCase } from '~/domain/forum/application/use-cases/question/edit-question'
import { DeleteQuestionUseCase } from '~/domain/forum/application/use-cases/question/delete-question'
import { AnswerQuestionUseCase } from '~/domain/forum/application/use-cases/answer/answer-question'
import { EditAnswerUseCase } from '~/domain/forum/application/use-cases/answer/edit-answer'
import { DeleteAnswerUseCase } from '~/domain/forum/application/use-cases/answer/delete-answer'
import { FetchQuestionAnswersUseCase } from '~/domain/forum/application/use-cases/answer/fetch-question-answers'
import { ChooseQuestionBestAnswerUseCase } from '~/domain/forum/application/use-cases/question/choose-question-best-answer'
import { CommentOnQuestionUseCase } from '~/domain/forum/application/use-cases/comment-question/comment-on-question'
import { DeleteQuestionCommentsUseCase } from '~/domain/forum/application/use-cases/comment-question/delete-question-comment'
import { CommentOnAnswerUseCase } from '~/domain/forum/application/use-cases/comment-answer/comment-on-answer'
import { DeleteAnswerCommentsUseCase } from '~/domain/forum/application/use-cases/comment-answer/delete-answer-comment'
import { FetchQuestionCommentsUseCase } from '~/domain/forum/application/use-cases/comment-question/fetch-question-comments'
import { FetchAnswerCommentsUseCase } from '~/domain/forum/application/use-cases/comment-answer/fetch-answer-comments'
import { UploadAndCreateAttachmentUseCase } from '~/domain/forum/application/use-cases/attachment/upload-and-create-attachment'
import { ReadNotificationUseCase } from '~/domain/notification/application/use-cases/read-notification'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
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
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
    FetchQuestionCommentsController,
    FetchAnswerCommentsController,
    UploadAttachmentController,
    ReadNotificationController,
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
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    DeleteQuestionCommentsUseCase,
    CommentOnAnswerUseCase,
    DeleteAnswerCommentsUseCase,
    FetchQuestionCommentsUseCase,
    FetchAnswerCommentsUseCase,
    UploadAndCreateAttachmentUseCase,
    ReadNotificationUseCase,
  ],
})
export class HTTPModule {}
