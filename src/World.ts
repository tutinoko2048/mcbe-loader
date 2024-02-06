import { Scoreboard } from './Scoreboard'; 
import { LevelDBWrapper } from './LevelDBWrapper';
import { Player } from './Player';
import { Entity } from './Entity';
import { DynamicPropertiesCollection, DynamicPropertyUtil } from './DynamicProperty';
import { WorldChunk } from './WorldChunk';
import { ChunkManager } from './ChunkManager';

export class World {
  public readonly db: LevelDBWrapper;
  public readonly scoreboard: Scoreboard = new Scoreboard();
  public readonly dynamicProperties: DynamicPropertiesCollection = {};
  public readonly chunkManager: ChunkManager;

  constructor(worldPath: string) {
    this.db = new LevelDBWrapper(worldPath);
    this.chunkManager = new ChunkManager(this);
  }

  get isOpen(): boolean {
    return this.db.levelDB.isOpen();
  }

  async open() {
    await this.db.levelDB.open();
    this.scoreboard.load(await this.db.get('scoreboard'));
    Object.assign(this.dynamicProperties, DynamicPropertyUtil.load(await this.db.get('DynamicProperties')));
    await this.chunkManager.load();
  }

  async saveAndClose() {
    await this.db.levelDB.close();
  }

  async getPlayers(): Promise<Player[]> {
    const keys = await this.db.getKeys();
    const playerKeys = keys.filter(k => k.startsWith('player') && k.includes('server'));
    playerKeys.push('~local_player');
    
    return await Promise.all(
      playerKeys.map(async key => new Player(await this.db.get(key)))
    )
  }

  async getEntities(): Promise<Entity[]> {
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