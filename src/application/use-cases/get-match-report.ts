import { left, right, type Either } from '../either'
import type { LogRepository } from '../repositories/log-repository'
import { InvalidDeathMeansError } from './_errors/invalid-death-means-error'
import { InvalidLogFileError } from './_errors/invalid-log-file-error'

type GetMatchReportResponse = Either<
  InvalidDeathMeansError,
  {
    ranking: {
      player: string
      score: number
      rank: number
    }[]
    matches: {
      id: string
      total_kills: number
      players: string[]
      kills: Record<string, number>
    }[]
  }
>

export class GetMatchReport {
  constructor(private logRepository: LogRepository) {}

  public execute(): GetMatchReportResponse {
    if (this.logRepository.parseError) {
      switch (this.logRepository.parseError) {
        case 'InvalidDeathMeansError':
          return left(new InvalidDeathMeansError())
        case 'InvalidLogFileError':
          return left(new InvalidLogFileError())
      }
    }
    const matches = this.logRepository.findAllMatches()
    const ranking = this.logRepository.getRanking()

    return right({ ranking, matches })
  }
}
