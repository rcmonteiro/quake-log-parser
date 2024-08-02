export enum meansOfDeath {
  MOD_UNKNOWN,
  MOD_SHOTGUN,
  MOD_GAUNTLET,
  MOD_MACHINEGUN,
  MOD_GRENADE,
  MOD_GRENADE_SPLASH,
  MOD_ROCKET,
  MOD_ROCKET_SPLASH,
  MOD_PLASMA,
  MOD_PLASMA_SPLASH,
  MOD_RAILGUN,
  MOD_LIGHTNING,
  MOD_BFG,
  MOD_BFG_SPLASH,
  MOD_WATER,
  MOD_SLIME,
  MOD_LAVA,
  MOD_CRUSH,
  MOD_TELEFRAG,
  MOD_FALLING,
  MOD_SUICIDE,
  MOD_TARGET_LASER,
  MOD_TRIGGER_HURT,
  MOD_NAIL,
  MOD_CHAINGUN,
  MOD_PROXIMITY_MINE,
  MOD_KAMIKAZE,
  MOD_JUICED,
  MOD_GRAPPLE,
}

export class Match {
  private readonly _id: string
  private _total_kills: number = 0
  private _players: string[] = []
  private _kills: Record<string, number> = {}
  private _kills_by_means: Record<string, number> = {}
  private _ranking: Record<string, number> = {}

  constructor(id: number) {
    this._id = `game_${id}`
  }

  public updateKills(
    killer: string,
    victim: string,
    deathMeans: string
  ): string {
    let parseError: string = ''
    this.incTotalKills()
    this.addPlayer(victim)
    this.addPlayer(killer)
    this.incKills(killer, victim)
    if (!this.addDeathMeans(deathMeans)) {
      parseError = 'InvalidDeathMeansError'
    }
    this.updateRanking(killer, victim)
    return parseError
  }

  private updateRanking(killer: string, victim: string): void {
    const incrementScoreRule = killer !== '<world>' && victim !== killer
    const decrementScoreRule = killer === '<world>' || victim === killer

    if (incrementScoreRule) {
      this._ranking[killer] += 1
    }
    if (decrementScoreRule) {
      this._ranking[victim] -= 1
    }
  }

  private incTotalKills(): void {
    this._total_kills += 1
  }

  public addPlayer(player: string): void {
    if (!this._players.includes(player) && player !== '<world>') {
      this._players.push(player)
      this._ranking[player] = 0
      this._kills[player] = 0
    }
  }

  private incKills(killer: string, victim: string): void {
    if (killer !== victim && killer !== '<world>') {
      this._kills[killer] += 1
    }
  }

  private addDeathMeans(death_means: string): boolean {
    if (death_means in meansOfDeath) {
      this._kills_by_means[death_means] =
        this._kills_by_means[death_means] + 1 || 1
      return true
    }

    return false
  }

  public MatchesToJSON() {
    const ranking = Object.entries(this._ranking).sort((a, b) => b[1] - a[1])
    const kills = Object.entries(this._kills).sort((a, b) => b[1] - a[1])
    const players = [...this._players].sort()
    return {
      [this._id]: {
        total_kills: this._total_kills,
        players,
        kills: Object.fromEntries(kills),
        ranking: Object.fromEntries(ranking),
      },
    }
  }

  public DeathsToJSON() {
    const kills_by_means = Object.entries(this._kills_by_means).sort(
      (a, b) => b[1] - a[1]
    )
    return {
      [this._id]: {
        total_kills: this._total_kills,
        kills_by_means: Object.fromEntries(kills_by_means),
      },
    }
  }
}
