import type { World } from './World';
import { WorldChunk } from './WorldChunk';

export class ChunkManager {
  public readonly chunks: { [dim: number]: { [cx: number]: { [cz: number]: WorldChunk } } } = {};
  constructor(
    public readonly world: World,
  ) {}
  
  async load() {
    const keys = await this.world.db.getEntries();
    for (const keyValue of keys) {
      const { key, skey } = keyValue;
      if (skey.startsWith('digp') || key.byteLength < 8) continue;

      const cx = key.readInt32LE(0);
      const cz = key.readInt32LE(4);

      let dim = 0;
      const hasDimensionParam = (key.byteLength > 18 || key.byteLength === 13 || key.byteLength === 14);
      if (hasDimensionParam) dim = key.readInt32LE(8);

      const tag = key[hasDimensionParam ? 12 : 8];
      
      this.chunks[dim] ??= {};
      this.chunks[dim][cx] ??= {};
      let chunk = this.chunks[dim][cx][cz];
      if (!chunk) {
        chunk = new WorldChunk(dim, cx, cz);
        this.chunks[dim][cx][cz] = chunk;
      }

      chunk.addKeyValue(keyValue, { tag, hasDimensionParam });
    }
  }
}