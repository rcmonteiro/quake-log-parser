import { LogRepository } from '../repositories/log-repository'
import { InvalidDeathMeansError } from './_errors/invalid-death-means-error'
import { InvalidLogFileError } from './_errors/invalid-log-file-error'
import { GetMatchReport } from './get-match-report'
import path from 'node:path'

describe('Get Match Report Use Case (unit tests)', () => {
  it('should parse a match report with a valid log file', async () => {
    const logFilePath = path.join(__dirname, '../../../logs/qgames-sample.log')
    const logRepository = new LogRepository(logFilePath)
    await logRepository.waitForParsing()
    const sut = new GetMatchReport(logRepository)

    const result = sut.execute()
    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.matches[0].game_1).toEqual({
        total_kills: 0,
        players: ['Isgalamido'],
        kills: {
          Isgalamido: 0,
        },
        ranking: {
          Isgalamido: 0,
        },
      })
      expect(result.value?.matches[1].game_2).toEqual({
        total_kills: 105,
        players: ['Assasinu Credi', 'Dono da Bola', 'Isgalamido', 'Zeh'],
        kills: {
          Isgalamido: 27,
          Zeh: 22,
          'Dono da Bola': 16,
          'Assasinu Credi': 15,
        },
        ranking: {
          Zeh: 20,
          Isgalamido: 19,
          'Assasinu Credi': 11,
          'Dono da Bola': 5,
        },
      })
    }
  })

  it('should not parse a match report with a invalid log file - wrong death means', async () => {
    const logFilePath = path.join(
      __dirname,
      '../../../logs/qgames-wrong-death-means.log'
    )
    const logRepository = new LogRepository(logFilePath)
    await logRepository.waitForParsing()
    const sut = new GetMatchReport(logRepository)

    const result = sut.execute()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidDeathMeansError)
  })

  it('should not parse a match report with a invalid log file - wrong file path', async () => {
    const logFilePath = path.join(
      __dirname,
      '../../../logs/qgames-inexistent-file.log'
    )
    const logRepository = new LogRepository(logFilePath)
    await logRepository.waitForParsing()
    const sut = new GetMatchReport(logRepository)

    const result = sut.execute()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidLogFileError)
  })
})
