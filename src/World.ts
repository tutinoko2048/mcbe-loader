import { existsSync } from 'fs';
import { LevelDB } from 'leveldb-zlib';
import { resolve } from 'path';
import * as nbt from 'prismarine-nbt';

export class LevelDBWrapper {
  public readonly levelDB: LevelDB;
  public readonly worldPath: string;
  constructor(worldPath: string) {
    if (!existsSync(resolve(process.cwd(), worldPath) + '/db')) throw Error('World not found');
    this.worldPath = worldPath;
    this.levelDB = new LevelDB(worldPath + '/db');
  }

  async open() {
    await this.levelDB.open();
  }

  async close() {
    await this.levelDB.close();
  }

  get isOpen(): boolean {
    return this.levelDB.isOpen();
  }

  async get(key: string | Buffer): Promise<nbt.NBT | undefined> {
    if (!key) throw Error('invalid key');
    if (!this.isOpen) await this.open();

    const rawData = await this.levelDB.get(key);
    if (!rawData) return;
    const { parsed } = await nbt.parse(rawData);
    return parsed;
  }

  async getAllKeys(): Promise<string[]> {
    const keys = [];
    const iterator = this.levelDB.getIterator({ keyAsBuffer: false });
    for await (const [key] of iterator) keys.push(key);
    return keys;
  }

  async put(key: string | Buffer, value: nbt.NBT) {
    if (!key) throw Error('invalid key');
    if (!this.isOpen) await this.open();
    
    const data = nbt.writeUncompressed(value);
    this.levelDB.put(key, data);
  }
}

interface PlayerRawData {
  data: nbt.NBT;
  info: nbt.NBT;
}

export class World {
  public db: LevelDBWrapper;

  constructor(worldPath: string) {
    this.db = new LevelDBWrapper(worldPath);
  }

  async open() {
    await this.db.open();
  }

  async saveAndClose() {
    await this.db.close();
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