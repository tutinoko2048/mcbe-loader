import { LevelDBWrapper } from './LevelDBWrapper';
import { Scoreboard } from './Scoreboard';
import { ChunkManager } from './ChunkManager';
import { Player } from '../entity/Player';
import { Entity } from '../entity/Entity';
import { processWorldData } from '../util';
import type { DynamicPropertiesCollection } from './DynamicProperty';
import type { WorldChunk } from './WorldChunk';
import type { NBT } from 'prismarine-nbt';
import { LevelDat } from './LevelDat';

export interface WorldLoadOptions {
  scoreboard?: boolean;
  dynamicProperty?: boolean;
  chunk?: boolean;
  entity?: boolean;
  player?: boolean;
}

export class World {
  public readonly db: LevelDBWrapper;
  public readonly levelDat: LevelDat;
  public readonly scoreboard: Scoreboard = new Scoreboard();
  public readonly dynamicProperties: DynamicPropertiesCollection = {};
  public readonly chunkManager: ChunkManager;
  public readonly entities: Entity[] = [];
  public readonly players: Player[] = [];
  public options?: WorldLoadOptions = {
    scoreboard: true,
    dynamicProperty: true,
    chunk: true,
    entity: true,
    player: true
  }

  constructor(worldPath: string, options?: WorldLoadOptions | boolean) {
    this.db = new LevelDBWrapper(worldPath);
    this.levelDat = new LevelDat(this);
    this.chunkManager = new ChunkManager(this);
    if (typeof options === 'boolean') {
      if (!options) this.options = {};
    } else {
      Object.assign(this.options, options ?? {});
    }
  }

  get isOpen(): boolean {
    return this.db.levelDB.isOpen();
  }

  async open() {
    await this.db.levelDB.open();
    await this.levelDat.load();
    await processWorldData(this);
  }

  async saveAndClose() {
    await this.db.levelDB.close();
  }

  async getPlayers(): Promise<Player[]> {
    if (this.options.player) return this.players;

    const keys = await this.db.getKeys();
    const playerKeys = keys.filter(k => k.startsWith('player') && k.includes('server'));
    playerKeys.push('~local_player');
    
    return await Promise.all(
      playerKeys.map(async key => new Player(await this.db.get(key)))
    );
  }

  async getEntities(): Promise<Entity[]> {
    if (this.options.entity) return this.entities;

    const keys = await this.db.getKeys();
    const entityKeys = keys.filter(k => k.startsWith('actorprefix'));
    return (await Promise.all(
      entityKeys.map(async key => {
        const data = await this.db.get(key);
        return data && new Entity(data);
      })
    )).filter(Boolean);
  }

  async getChunks(): Promise<WorldChunk[]> {
    const chunks = [];
    for (const dimensionChunks of Object.values(this.chunkManager.chunks)) {
      for (const xChunks of Object.values(dimensionChunks)) {
        for (const chunk of Object.values(xChunks)) {
          chunks.push(chunk);
        }
      }
    }
    return chunks;
  }
}