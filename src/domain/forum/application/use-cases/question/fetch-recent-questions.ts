import { QuestionsRepository } from '../../repositories/question-repository'
import { Question } from '../../../enterprise/entities/question'
import { Either, right } from '~/core/either'

interface FetchRecentQuestionsUseCaseRequest {
  page: number
}
type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>

export class FetchRecentQuestionsUseCase {
  constructor(private questionRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionRepository.findManyRecent({ page })

    return right({ questions })
  }
}
