import * as nbt from 'prismarine-nbt';

export enum ScoreboardIdentityType {
  Player = "Player",
  Entity = "Entity",
  FakePlayer = "FakePlayer"
}

function toIdentityType(internalType: number): ScoreboardIdentityType {
  switch (internalType) {
    case 1: return ScoreboardIdentityType.Player;
    case 2: return ScoreboardIdentityType.Entity;
    case 3: return ScoreboardIdentityType.FakePlayer;
    default: throw new TypeError(`unknown identity type: ${internalType}`);
  }
}

export class ScoreboardObjective {
  private scoreboard: Scoreboard;
  private data: any;

  constructor(scoreboard: Scoreboard, data: any) {
    this.scoreboard = scoreboard;
    this.data = data;
  }
  
  get id(): string {
    return this.data.Name.value;
  }
  
  get displayName(): string {
    return this.data.DisplayName.value;
  }
  
  getScores(): ScoreboardScoreInfo[] {
    return this.data.Scores.value.value.map(data => new ScoreboardScoreInfo(this.scoreboard, data))
  }
  
  getScore(participant: ScoreboardIdentity | string): number | undefined {
    if (participant instanceof ScoreboardIdentity) {
      return this.getScores().find(info => info.participant.id === participant.id).score;
    } else if (typeof participant === 'string') {
      return this.getScores().find(info => info.participant.type === ScoreboardIdentityType.FakePlayer && info.participant.displayName === participant).score;
    }
    throw TypeError('unexpected type');
  }
  
  toJSON() {
    return { id: this.id, displayName: this.displayName }
  }
}

export class ScoreboardIdentity {
  private scoreboard: Scoreboard;
  private data: any;

  constructor(scoreboard: Scoreboard, data: any) {
    this.scoreboard = scoreboard;
    this.data = data;
  }
  
  get displayName(): string {
    switch (this.type) {
      case ScoreboardIdentityType.Player: return this.data.PlayerId.value;
      case ScoreboardIdentityType.Entity: return this.data.EntityID.value;
      case ScoreboardIdentityType.FakePlayer: return this.data.FakePlayerName.value;
      default: throw new TypeError(`unhandled type value: ${this.type}`);
    }
  }
  
  get id(): string {
    return this.data.ScoreboardId.value;
  }
  
  get type(): ScoreboardIdentityType {
    return toIdentityType(this.data.IdentityType.value);
  }
  
  toJSON() {
    return { id: this.id, displayName: this.displayName, type: this.type }
  }
}

export class ScoreboardScoreInfo {
  private scoreboard: Scoreboard;
  private data: any;

  constructor(scoreboard: Scoreboard, data: any) {
    this.scoreboard = scoreboard;
    this.data = data;
  }
  
  get score(): number {
    return this.data.Score.value;
  }
  
  get participant(): ScoreboardIdentity {
    return this.scoreboard.getParticipants().find(identity => identity.id === this.data.ScoreboardId.value);
  }
  
  toJSON() {
    return { score: this.score, participant: this.participant }
  }
}
export class Scoreboard {
  data: nbt.NBT;
  
  constructor(data: any) {
    this.data = data;
  }
  
  getObjectives(): ScoreboardObjective[] {
    return this.data.value.Objectives.value.value.map(data => new ScoreboardObjective(this, data))
  }
  
  getObjective(objectiveId: string): ScoreboardObjective | undefined {
    return this.getObjectives().find(objective => objective.id === objectiveId);
  }
  
  getParticipants(): ScoreboardIdentity[] {
    const entries = this.data.value.Entries;
    entries.value
    return this.data.value.Entries.value.value.map(data => new ScoreboardIdentity(this, data));
  }
}