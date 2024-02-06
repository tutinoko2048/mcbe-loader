import { existsSync } from 'fs';
import { LevelDB } from 'leveldb-zlib';
import { resolve } from 'path';
import * as nbt from 'prismarine-nbt'; 
import { LevelKey } from './LevelKey';

// Microsoft Creator Docs
// https://learn.microsoft.com/en-us/minecraft/creator/documents/actorstorage
// minecraft-creator-tools/WorldChunk/addKeyValue
// https://github.com/Mojang/minecraft-creator-tools/blob/main/app/src/minecraft/WorldChunk.ts#L138
export enum WorldChunkTag {
  Data3D = 43,
  Version, // This was moved to the front as needed for the extended heights feature. Old chunks will not have this data.
  Data2D = 45,
  Data2DLegacy = 46,
  SubChunkPrefix = 47,
  LegacyTerrain = 48,
  BlockEntity = 49,
  Entity = 50, // Legacy actor storage which will be deleted from LevelDB upon upgrading the chunk to use modern actor storage
  PendingTicks = 51,
  LegacyBlockExtraData = 52,
  BiomeState = 53,
  FinalizedState = 54,
  ConversionData = 55, // Data that the converter provides that are used at runtime for things like blending
  BorderBlocks = 56,
  HardcodedSpawners = 57,
  RandomTicks = 58,
  CheckSums = 59,
  GenerationSeed = 60,
  GeneratedPreCavesAndCliffsBlending = 61,
  BlendingBiomeHeight = 62,
  MetadataHash = 63,
  BlendingData = 64,
  ActorDigestVersion = 65,
  LegacyVersion = 118
};

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