import { WorldChunkTag } from './LevelDBWrapper';
import type { LevelKey } from './LevelKey';

interface ChunkKeyInfo {
  tag: WorldChunkTag;
  hasDimensionParam: boolean;
}

export class WorldChunk {
  constructor(
    public dimension: number,
    public x: number,
    public z: number
  ) {}

  addKey(levelKey: LevelKey, info: ChunkKeyInfo) {
    const { hasDimensionParam, tag } = info;
  }
}