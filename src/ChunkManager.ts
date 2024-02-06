import type { World } from './World';
import { WorldChunk } from './WorldChunk';

export class ChunkManager {
  public chunks: { [dim: number]: { [cx: number]: { [cz: number]: WorldChunk } } } = {};
  constructor(
    public world: World,
  ) {}
  
  async load() {
    const keys = await this.world.db.getEntries();
    for (const levelKey of keys) {
      const { buffer, byteLength, key } = levelKey;
      if (key.startsWith('digp') || byteLength < 8) continue;

      const cx = buffer.readInt32LE(0);
      const cz = buffer.readInt32LE(4);

      let dim = 0;
      const hasDimensionParam = byteLength === 13 || byteLength === 14;
      if (hasDimensionParam) dim = buffer.readInt32LE(8);

      const tag = buffer[hasDimensionParam ? 12 : 8];
      
      this.chunks[dim] ??= {};
      this.chunks[dim][cx] ??= {};
      let chunk = this.chunks[dim][cx][cz];
      if (!chunk) {
        chunk = new WorldChunk(dim, cx, cz);
        this.chunks[dim][cx][cz] = chunk;
      }

      chunk.addKey(levelKey, { tag, hasDimensionParam });
    }
  }
}