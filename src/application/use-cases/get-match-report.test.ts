import { LogRepository } from '../repositories/log-repository'
import { InvalidDeathMeansError } from './_errors/invalid-death-means-error copy'
import { GetMatchReport } from './get-match-report'
import path from 'node:path'

describe('Get Match Report Use Case', () => {
  it('should parse a match report with a valid log file', () => {
    const logFilePath = path.join(__dirname, '../../../logs/qgames-sample.log')
    const logRepository = new LogRepository(logFilePath)
    const sut = new GetMatchReport(logRepository)

    const result = sut.execute()
    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.matches[0]).toEqual({
        id: 'game_1',
        total_kills: 0,
        players: [],
        kills: {},
      })
      expect(result.value?.matches[1]).toEqual({
        id: 'game_2',
        total_kills: 105,
        players: ['Isgalamido', 'Dono da Bola', 'Zeh', 'Assasinu Credi'],
        kills: {
          'Dono da Bola': 20,
          Isgalamido: 27,
          Zeh: 22,
          'Assasinu Credi': 16,
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
    const sut = new GetMatchReport(logRepository)

    const result = sut.execute()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidDeathMeansError)
  })
})
