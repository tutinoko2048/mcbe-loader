import { LevelKeyValue } from './LevelKeyValue';
import { BlockEntity } from '../entity/BlockEntity';
import { Dimension } from '../types';

// Microsoft Creator Docs
// https://learn.microsoft.com/en-us/minecraft/creator/documents/actorstorage
// minecraft-creator-tools/WorldChunk/addKeyValue
// https://github.com/Mojang/minecraft-creator-tools/blob/main/app/src/minecraft/WorldChunk.ts#L138
export enum WorldChunkTag {
  Data3D = 43,
  Version = 44, // This was moved to the front as needed for the extended heights feature. Old chunks will not have this data.
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
}

interface ChunkKeyInfo {
  tag: WorldChunkTag;
  hasDimensionParam: boolean;
}

export class WorldChunk {
  public readonly subChunks: LevelKeyValue[] = new Array(64);
  public readonly subChunkVersions: number[] = new Array(64);
  public chunkVersion: LevelKeyValue | undefined;
  public blockEntityKeys: LevelKeyValue[] = [];

  constructor(
    public readonly dimension: Dimension,
    public readonly x: number,
    public readonly z: number
  ) {}

  async getBlockEntities() {
    return Promise.all(
      this.blockEntityKeys.map(async (keyValue) => new BlockEntity(await keyValue.toNBT()))
    );
  }

  addKeyValue(keyValue: LevelKeyValue, info: ChunkKeyInfo) {
    const { hasDimensionParam, tag } = info;
    switch (tag) {
      case WorldChunkTag.Version:
        this.chunkVersion = keyValue;
        break;

      case WorldChunkTag.SubChunkPrefix:
        const subChunkIndex = keyValue.key.readInt8(hasDimensionParam ? 9 + 4 : 9);
        if (subChunkIndex < 0) return;
        this.subChunks[subChunkIndex] ??= keyValue;
        this.subChunkVersions[subChunkIndex] ??= keyValue.value[0];
        break;

      case WorldChunkTag.BlockEntity:
        this.blockEntityKeys.push(keyValue);
        break;
    }
  }

  get [Symbol.toStringTag]() {
    return `${this.x}, ${this.z}`;
  }
}