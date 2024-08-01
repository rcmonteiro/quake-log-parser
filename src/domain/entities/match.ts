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

  constructor(id: number) {
    this._id = `game_${id}`
  }

  public incTotalKills(): void {
    this._total_kills = this._total_kills + 1 || 1
  }

  public addPlayer(player: string): void {
    if (!this._players.includes(player) && player !== '<world>') {
      this._players.push(player)
    }
  }

  public incKills(player: string): void {
    if (player !== '<world>') {
      this._kills[player] = this._kills[player] + 1 || 1
    }
  }

  public addDeathMeans(death_means: string): boolean {
    if (death_means in meansOfDeath) {
      this._kills_by_means[death_means] =
        this._kills_by_means[death_means] + 1 || 1
      return true
    }

    return false
  }

  public MatchesToJSON() {
    return {
      id: this._id,
      total_kills: this._total_kills,
      players: this._players,
      kills: this._kills,
    }
  }

  public DeathsToJSON() {
    return {
      id: this._id,
      total_kills: this._total_kills,
      kills_by_means: this._kills_by_means,
    }
  }
}
