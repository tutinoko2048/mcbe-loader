import { existsSync } from 'fs';
import * as nbt from 'prismarine-nbt';
import { Scoreboard } from './Scoreboard'; 
import { LevelDBWrapper } from './LevelDBWrapper';
import { Player } from './Player';

interface PlayerRawData {
  data: nbt.NBT;
  info: nbt.NBT;
}

export class World {
  public readonly db: LevelDBWrapper;
  public readonly scoreboard: Scoreboard;

  constructor(worldPath: string) {
    this.db = new LevelDBWrapper(worldPath);
    this.scoreboard = new Scoreboard();
  }

  get isOpen(): boolean {
    return this.db.levelDB.isOpen();
  }

  async open() {
    await this.db.levelDB.open();
    this.scoreboard.load(await this.db.get('scoreboard'));
  }

  async saveAndClose() {
    await this.db.levelDB.close();
  }

  async getPlayers(): Promise<Player[]> {
    const keys = await this.db.getAllKeys();
    const playerKeys = keys.filter(k => k.startsWith('player') && k.includes('server'));
    playerKeys.push('~local_player');
    
    return await Promise.all(
      playerKeys.map(async key => new Player(await this.db.get(key)))
    )
  }
}