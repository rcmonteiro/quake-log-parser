import { Match } from '@/domain/entities/match'
import { readFileSync } from 'fs'

export class LogRepository {
  private matches: Match[] = []
  public parseError: string = ''

  constructor(logPath: string) {
    try {
      const data = this.readLogFile(logPath)
      if (data) {
        this.parseLog(data)
      }
    } catch (error) {
      this.parseError = 'InvalidLogFileError'
      console.error(error) // TODO: Set observability integration
    }
  }

  private readLogFile(logPath: string): string[] | void {
    try {
      const data = readFileSync(logPath, 'utf8')
      return data.split('\n')
    } catch (error) {
      this.parseError = 'InvalidLogFileError'
      console.error(error) // TODO: Set observability integration
    }
  }

  private parseLog(data: string[]): void {
    let currentMatch: Match
    let gameCount = 0
    const gameInitPattern = /^\s*\d{1,3}:\d{2}\sInitGame:/
    const userInfoChangedPattern =
      /^\s*\d{1,3}:\d{2}\sClientUserinfoChanged:\s\d+\sn\\([a-zA-Z0-9 ]+)\\t/
    const killPattern =
      /^\s*\d{1,3}:\d{2}\sKill:\s[0-9]+\s[0-9]+\s[0-9]+:\s([<>a-zA-Z0-9 ]+)\skilled\s([a-zA-Z0-9 ]+)\sby\s([A-Z_]+)$/

    data.forEach((line) => {
      if (gameInitPattern.test(line)) {
        gameCount++
        currentMatch = new Match(gameCount)
        this.matches.push(currentMatch)
      }

      if (userInfoChangedPattern.test(line)) {
        const [, name] = userInfoChangedPattern.exec(line) || []
        currentMatch.addPlayer(name)
      }

      if (killPattern.test(line)) {
        const [, killer, victim, deathMeans] = killPattern.exec(line) || []
        this.parseError = currentMatch.updateKills(killer, victim, deathMeans)
      }
    })
  }

  public findAllMatches() {
    return this.matches.map((match) => match.MatchesToJSON())
  }

  public findAllDeaths() {
    return this.matches.map((match) => match.DeathsToJSON())
  }
}
