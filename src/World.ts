import { existsSync } from 'fs';
import { LevelDB } from 'leveldb-zlib';
import { resolve } from 'path';
import * as nbt from 'prismarine-nbt';
import { Scoreboard } from './Scoreboard'; 
import { LevelDBWrapper } from './LevelDBWrapper';

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
/*
  async getPlayers(): Promise<Player[]> {
    const keys = await this.db.getAllKeys();
    const playerInfoKeys = keys.filter(k => k.startsWith('player') && !k.includes('server'));

    const getPlayerData = async (key: string) => {
      return (await this.db.get(key))?.value;
    }


    const promises: Promise<PlayerRawData>[] = playerInfoKeys.map(async infoKey => {
      const info = await this.db.get(infoKey);
      if (!info) return;
      return {
        data: 
        info: info.value
      };
    });
      
    const playersData = (await Promise.all(promises));
  }
  */
}