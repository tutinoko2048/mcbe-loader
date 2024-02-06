import { existsSync } from 'fs';
import { LevelDB } from 'leveldb-zlib';
import { resolve } from 'path';
import * as nbt from 'prismarine-nbt'; 
import { LevelKey } from './LevelKey';

export class LevelDBWrapper {
  public readonly levelDB: LevelDB;
  public readonly worldPath: string;
  
  constructor(worldPath: string) {
    if (!existsSync(resolve(process.cwd(), worldPath) + '/db')) throw Error('World not found');
    this.worldPath = worldPath;
    this.levelDB = new LevelDB(worldPath + '/db');
  }

  async get(key: string | Buffer): Promise<nbt.NBT | undefined> {
    if (!key) throw Error('invalid key');
    if (!this.levelDB.isOpen()) await this.levelDB.open();

    const rawData = await this.levelDB.get(key);
    if (!rawData) return;
    const { parsed } = await nbt.parse(rawData);
    return parsed;
  }

  async getAllKeys(keyAsBuffer?: false): Promise<string[]>;
  async getAllKeys(keyAsBuffer: true): Promise<Buffer[]>;
  async getAllKeys(keyAsBuffer: boolean = false): Promise<string[] | Buffer[]> {
    if (!this.levelDB.isOpen()) await this.levelDB.open();
    const keys = [];
    const iterator = this.levelDB.getIterator({ keyAsBuffer });
    for await (const [key] of iterator) keys.push(key);
    return keys;
  }

  async getAllKeysRaw(): Promise<LevelKey[]> {
    if (!this.levelDB.isOpen()) await this.levelDB.open();
    const keys: LevelKey[] = [];
    const iterator = this.levelDB.getIterator({ keyAsBuffer: true });
    for await (const [key] of iterator) keys.push(new LevelKey(key));
    return keys;
  }

  async put(key: string | Buffer, value: nbt.NBT): Promise<boolean> {
    if (!key) throw Error('invalid key');
    if (!this.levelDB.isOpen()) await this.levelDB.open();

    const rawData = nbt.writeUncompressed(value);
    return await this.levelDB.put(key, rawData);
  }
  
  async has(key: string | Buffer): Promise<boolean> {
    return !!await this.get(key);
  }
}