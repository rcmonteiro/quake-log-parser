import { LogRepository } from '../repositories/log-repository'
import { InvalidDeathMeansError } from './_errors/invalid-death-means-error copy'
import { GetDeathReport } from './get-death-report'
import path from 'node:path'

describe('Get Death Report Use Case', () => {
  it('should parse a match report with a valid log file', () => {
    const logFilePath = path.join(__dirname, '../../../logs/qgames-sample.log')
    const logRepository = new LogRepository(logFilePath)
    const sut = new GetDeathReport(logRepository)

    const result = sut.execute()
    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.matches[0]).toEqual({
        id: 'game_1',
        total_kills: 0,
        kills_by_means: {},
      })
      expect(result.value?.matches[1]).toEqual({
        id: 'game_2',
        total_kills: 105,
        kills_by_means: {
          MOD_TRIGGER_HURT: 9,
          MOD_FALLING: 11,
          MOD_ROCKET: 20,
          MOD_RAILGUN: 8,
          MOD_ROCKET_SPLASH: 51,
          MOD_MACHINEGUN: 4,
          MOD_SHOTGUN: 2,
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
    const sut = new GetDeathReport(logRepository)

    const result = sut.execute()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidDeathMeansError)
  })
})
