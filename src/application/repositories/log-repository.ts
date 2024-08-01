import { Match } from '@/domain/entities/match'
import { readFileSync } from 'fs'

export class LogRepository {
  private matches: Match[] = []
  private ranking: Record<string, number> = {}
  public parseError: string = ''

  constructor(logPath: string) {
    try {
      const data = this.readLogFile(logPath)
      this.parseLog(data)
    } catch (error) {
      this.parseError = 'InvalidLogFileError'
      console.error(error) // TODO: Set observability integration
    }
  }

  private readLogFile(logPath: string): string[] {
    const data = readFileSync(logPath, 'utf8')
    return data.split('\n')
  }

  private parseLog(data: string[]): void {
    let currentMatch: Match
    let gameCount = 0
    const killPattern =
      /^\s*\d{1,2}:\d{2}\sKill:\s[0-9]+\s[0-9]+\s[0-9]+:\s([<>a-zA-Z0-9 ]+)\skilled\s([a-zA-Z0-9 ]+)\sby\s([A-Z_]+)$/

    data.forEach((line) => {
      if (/^\s*\d{1,2}:\d{2}\sInitGame:/.test(line)) {
        gameCount++
        currentMatch = new Match(gameCount)
        this.matches.push(currentMatch)
      }

      if (killPattern.test(line)) {
        const [, killer, victim, death_means] = killPattern.exec(line) || []
        currentMatch.incTotalKills()
        currentMatch.addPlayer(victim)
        currentMatch.addPlayer(victim)
        currentMatch.incKills(killer)
        if (!currentMatch.addDeathMeans(death_means)) {
          this.parseError = 'InvalidDeathMeansError'
        }
        this.updateRanking(killer, victim)
      }
    })
  }

  private updateRanking(killer: string, victim: string): void {
    if (killer !== '<world>') {
      this.ranking[killer] = this.ranking[killer] + 1 || 1
    }
    this.ranking[victim] = this.ranking[victim] - 1 || -1
  }

  public findAllMatches() {
    return this.matches.map((match) => match.MatchesToJSON())
  }

  public findAllDeaths() {
    return this.matches.map((match) => match.DeathsToJSON())
  }

  public getRanking() {
    return Object.entries(this.ranking)
      .sort((a, b) => b[1] - a[1])
      .map((item, index) => {
        return { player: item[0], score: item[1], rank: index + 1 }
      })
  }
}
