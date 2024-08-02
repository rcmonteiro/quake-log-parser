import { Match } from '@/domain/entities/match'
import { createReadStream } from 'node:fs'
import { createInterface } from 'readline'

export class LogRepository {
  private matches: Match[] = []
  public parseError: string = ''
  private parsingComplete: Promise<void>

  constructor(logPath: string) {
    this.parsingComplete = this.parseLog(logPath)
  }

  public async waitForParsing(): Promise<void> {
    await this.parsingComplete
  }

  private async parseLog(logPath: string): Promise<void> {
    return new Promise((resolve) => {
      try {
        let currentMatch: Match
        let gameCount = 0
        const gameInitPattern = /^\s*\d{1,3}:\d{2}\sInitGame:/
        const userInfoChangedPattern =
          /^\s*\d{1,3}:\d{2}\sClientUserinfoChanged:\s\d+\sn\\([a-zA-Z0-9 ]+)\\t/
        const killPattern =
          /^\s*\d{1,3}:\d{2}\sKill:\s[0-9]+\s[0-9]+\s[0-9]+:\s([<>a-zA-Z0-9 ]+)\skilled\s([a-zA-Z0-9 ]+)\sby\s([A-Z_]+)$/

        const readStream = createReadStream(logPath)
        const readLine = createInterface({
          input: readStream,
          crlfDelay: Infinity,
        })

        readLine.on('line', (line) => {
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
            this.parseError = currentMatch.updateKills(
              killer,
              victim,
              deathMeans
            )
          }
        })

        readLine.on('close', () => {
          resolve()
        })

        readLine.on('error', (error) => {
          this.parseError = 'InvalidLogFileError'
          console.error('Error parsing log file:', error) // TODO: Set observability integration
          resolve()
        })
      } catch (error) {
        this.parseError = 'InvalidLogFileError'
        console.error('Error parsing log file:', error) // TODO: Set observability integration
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
