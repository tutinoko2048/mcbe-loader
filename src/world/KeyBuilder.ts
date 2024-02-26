import { BinaryStream } from 'binarystream.js';
import { WorldChunkTag } from './WorldChunk';

export namespace KeyBuilder {
  export function baseChunkKey(cx: number, cz: number, dimension: number, tag?: WorldChunkTag): BinaryStream {
    const stream = new BinaryStream();
    stream.writeInt32(cx);
    stream.writeInt32(cz);
    if (dimension) stream.writeInt32(dimension);
    if (tag !== undefined) stream.writeByte(tag);
    return stream;
  }
}