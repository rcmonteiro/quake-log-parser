import { left, right, type Either } from '../either'
import type { LogRepository } from '../repositories/log-repository'
import { InvalidDeathMeansError } from './_errors/invalid-death-means-error copy'

type GetDeathReportResponse = Either<
  InvalidDeathMeansError,
  {
    matches: {
      id: string
      total_kills: number
      kills_by_means: Record<string, number>
    }[]
  }
>

export class GetDeathReport {
  constructor(private logRepository: LogRepository) {}

  public execute(): GetDeathReportResponse {
    if (this.logRepository.parseError) {
      switch (this.logRepository.parseError) {
        case 'InvalidDeathMeansError':
          return left(new InvalidDeathMeansError())
      }
    }
    const matches = this.logRepository.findAllDeaths()

    return right({ matches })
  }
}
