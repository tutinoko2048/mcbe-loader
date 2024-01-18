import { NBT, TagType, Tags } from 'prismarine-nbt';

type Data = Record<string, Tags[TagType]>;

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
  private _scoreboard: Scoreboard;
  public _data: Data;

  constructor(scoreboard: Scoreboard, data: Data) {
    this._scoreboard = scoreboard;
    this._data = data;
  }
  
  get id(): string {
    return this._data.Name.value as string;
  }
  
  get displayName(): string {
    return this._data.DisplayName.value as string;
  }
  
  getScores(): ScoreboardScoreInfo[] {
    const _scores = this._data.Scores;
    if (_scores.type !== TagType.List) return [];
    return _scores.value.value.map((data: any) => new ScoreboardScoreInfo(this._scoreboard, data));
  }
  
  getScore(participant: ScoreboardIdentity | string): number | undefined {
    if (participant instanceof ScoreboardIdentity) {
      return this.getScores().find(info => info.participant.id === participant.id)?.score;
    } else if (typeof participant === 'string') {
      return this.getScores().find(info =>
        info.participant.type === ScoreboardIdentityType.FakePlayer &&
        info.participant.displayName === participant
      )?.score;
    }
    throw TypeError('unexpected type');
  }
  
  toJSON() {
    return { id: this.id, displayName: this.displayName }
  }
}

export class ScoreboardIdentity {
  private _scoreboard: Scoreboard;
  public _data: Data;

  constructor(scoreboard: Scoreboard, data: Data) {
    this._scoreboard = scoreboard;
    this._data = data;
  }
  
  get displayName(): string {
    switch (this.type) {
      case ScoreboardIdentityType.Player: return String(this._data.PlayerId.value);
      case ScoreboardIdentityType.Entity: return String(this._data.EntityID.value);
      case ScoreboardIdentityType.FakePlayer: return this._data.FakePlayerName.value as string;
      default: throw new TypeError(`unhandled type value: ${this.type}`);
    }
  }
  
  get id(): BigInt {
    if (this._data.ScoreboardId.type !== TagType.Long) return;
    return this._data.ScoreboardId.value as unknown as BigInt;
  }
  
  get type(): ScoreboardIdentityType {
    return toIdentityType(this._data.IdentityType.value as number);
  }
  
  toJSON() {
    return { id: String(this.id), displayName: this.displayName, type: this.type }
  }
}

export class ScoreboardScoreInfo {
  private _scoreboard: Scoreboard;
  public _data: Data;

  constructor(scoreboard: Scoreboard, data: Data) {
    this._scoreboard = scoreboard;
    this._data = data;
  }
  
  get score(): number {
    return this._data.Score.value as number;
  }
  
  get participant(): ScoreboardIdentity | undefined {
    return this._scoreboard.getParticipants().find(identity =>
      String(identity.id) === String(this.id)
    );
  }

  get id(): BigInt {
    if (this._data.ScoreboardId.type !== TagType.Long) return;
    return this._data.ScoreboardId.value as unknown as BigInt;
  }
  
  toJSON() {
    return { score: this.score, participant: this.participant?.toJSON(), id: String(this.id) }
  }
}

export class Scoreboard {
  public _data: NBT;
  public loaded: boolean = false;
  
  constructor() {}

  async load(data: NBT) {
    this._data = data;
    this.loaded = true;
  }
  
  getObjectives(): ScoreboardObjective[] {
    const _objectives = this._data.value.Objectives;
    if (_objectives.type !== TagType.List || _objectives.value.type !== TagType.Compound) return [];
    return _objectives.value.value.map((data: any) => new ScoreboardObjective(this, data));
  }
  
  getObjective(objectiveId: string): ScoreboardObjective | undefined {
    return this.getObjectives().find(objective => objective.id === objectiveId);
  }
  
  getParticipants(): ScoreboardIdentity[] {
    if (this._data?.value.Entries.type !== TagType.List) return [];
    return this._data.value.Entries.value.value.map((data: any) => new ScoreboardIdentity(this, data));
  }
}