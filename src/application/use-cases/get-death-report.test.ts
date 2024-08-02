import { LogRepository } from '../repositories/log-repository'
import { InvalidDeathMeansError } from './_errors/invalid-death-means-error'
import { InvalidLogFileError } from './_errors/invalid-log-file-error'

import { GetDeathReport } from './get-death-report'
import path from 'node:path'

describe('Get Death Report Use Case (unit tests)', () => {
  it('should parse a death report with a valid log file', async () => {
    const logFilePath = path.join(__dirname, '../../../logs/qgames-sample.log')
    const logRepository = new LogRepository(logFilePath)
    await logRepository['parsingComplete']
    const sut = new GetDeathReport(logRepository)

    const result = sut.execute()
    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.matches[0].game_1).toEqual({
        total_kills: 0,
        kills_by_means: {},
      })
      expect(result.value?.matches[1].game_2).toEqual({
        total_kills: 105,
        kills_by_means: {
          MOD_ROCKET_SPLASH: 51,
          MOD_ROCKET: 20,
          MOD_FALLING: 11,
          MOD_TRIGGER_HURT: 9,
          MOD_RAILGUN: 8,
          MOD_MACHINEGUN: 4,
          MOD_SHOTGUN: 2,
        },
      })
    }
  })

  it('should not parse a death report with a invalid log file - wrong death means', async () => {
    const logFilePath = path.join(
      __dirname,
      '../../../logs/qgames-wrong-death-means.log'
    )
    const logRepository = new LogRepository(logFilePath)
    await logRepository['parsingComplete']
    const sut = new GetDeathReport(logRepository)

    const result = sut.execute()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidDeathMeansError)
  })

  it('should not parse a death report with a invalid log file - wrong file path', async () => {
    const logFilePath = path.join(
      __dirname,
      '../../../logs/qgames-inexistent-file.log'
    )
    const logRepository = new LogRepository(logFilePath)
    await logRepository['parsingComplete']
    const sut = new GetDeathReport(logRepository)

    const result = sut.execute()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidLogFileError)
  })
})
