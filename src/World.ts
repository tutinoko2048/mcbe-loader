import { Scoreboard } from './Scoreboard'; 
import { LevelDBWrapper } from './LevelDBWrapper';
import { Player } from './Player';
import { DynamicPropertiesCollection, DynamicPropertyUtil } from './DynamicProperty';

export class World {
  public readonly db: LevelDBWrapper;
  public readonly scoreboard: Scoreboard;
  public readonly dynamicProperties: DynamicPropertiesCollection;

  constructor(worldPath: string) {
    this.db = new LevelDBWrapper(worldPath);
    this.scoreboard = new Scoreboard();
    this.dynamicProperties = {}
  }

  get isOpen(): boolean {
    return this.db.levelDB.isOpen();
  }

  async open() {
    await this.db.levelDB.open();
    this.scoreboard.load(await this.db.get('scoreboard'));
    Object.assign(this.dynamicProperties, DynamicPropertyUtil.load(await this.db.get('DynamicProperties')));
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