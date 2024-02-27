import { existsSync } from 'fs';
import { LevelDB } from 'leveldb-zlib';
import { resolve } from 'path';
import * as nbt from 'prismarine-nbt'; 
import { LevelKey, LevelKeyValue } from './LevelKeyValue';

export class LevelDBWrapper {
  public readonly levelDB: LevelDB;
  public readonly worldPath: string;
  public keyValues: LevelKeyValue[] = [];
  private isChanged: boolean = true;
  
  constructor(worldPath: string) {
    if (!existsSync(resolve(process.cwd(), worldPath) + '/db')) throw Error('World not found');
    this.worldPath = worldPath;
    this.levelDB = new LevelDB(worldPath + '/db');
  }

  async get(key: string | Buffer | LevelKey): Promise<nbt.NBT | undefined> {
    if (!key) throw Error('invalid key');
    if (!this.levelDB.isOpen()) await this.levelDB.open();
    
    const rawData = await this.levelDB.get(key instanceof LevelKey ? key.key : key);
    if (!rawData) return;
    const { parsed } = await nbt.parse(rawData);
    return parsed;
  }

  async getKeys(asLevelKey?: false): Promise<string[]>;
  async getKeys(asLevelKey: true): Promise<LevelKey[]>;
  async getKeys(asLevelKey: boolean = false): Promise<string[] | LevelKey[]> {
    if (!this.levelDB.isOpen()) await this.levelDB.open();
    const keys = [];
    const iterator = this.levelDB.getIterator({ keyAsBuffer: asLevelKey, keys: true, values: false });
    for await (const [key] of iterator) {
      keys.push(asLevelKey ? new LevelKey(key) : key);
    }
    return keys;
  }

  async getEntries(): Promise<LevelKeyValue[]> {
    if (!this.levelDB.isOpen()) await this.levelDB.open();
    if (!this.isChanged) return this.keyValues;
    const keyValues: LevelKeyValue[] = [];
    const iterator = this.levelDB.getIterator({ keyAsBuffer: true });
    for await (const [key, value] of iterator) keyValues.push(new LevelKeyValue(key, value));
    this.keyValues = keyValues;
    this.isChanged = false;
    return keyValues;
  }

  async put(key: string | Buffer, value: nbt.NBT): Promise<boolean> {
    if (!key) throw Error('invalid key');
    if (!this.levelDB.isOpen()) await this.levelDB.open();

    const rawData = nbt.writeUncompressed(value);
    const res = await this.levelDB.put(key, rawData);
    this.isChanged = true;
    return res;
  }
  
  async has(key: string | Buffer): Promise<boolean> {
    return !!await this.get(key);
  }
}