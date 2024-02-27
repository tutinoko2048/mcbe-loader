import { NBT, TagType } from 'prismarine-nbt';
import { DynamicPropertiesCollection, DynamicPropertyUtil } from '../world/DynamicProperty';
import type { Vector3, Vector2 } from '../types';
import type { LevelKey } from '../world/LevelKeyValue';
import type { World } from '../world/World';

export class Entity {
  public readonly _data: NBT;
  public readonly dynamicProperties: DynamicPropertiesCollection;

  constructor(
    public world: World,
    public key: LevelKey,
    data: NBT
  ) {
    this._data = data;
    this.dynamicProperties = DynamicPropertyUtil.load(this._data.value.DynamicProperties as any);
  }

  async save() {
    await this.world.db.put(this.key.skey, this._data);
  }

  isValid(): boolean {
    const uniqueId = this._data.value.UniqueID;
    return !!uniqueId?.value;
  }

  get id(): string {
    const value = this._data.value.UniqueID.value as unknown as BigInt;
    return String(value);
  }

  get typeId(): string {
    return this._data.value.identifier.value as unknown as string;
  }

  get tags(): string[] {
    const tags = this._data.value.Tags;
    if (tags?.type !== TagType.List) return [];
    return tags.value.value as string[];
  }

  get location(): Vector3 {
    const pos = this._data.value.Pos;
    if (pos.type !== TagType.List) return;
    const [x, y, z] = pos.value.value as number[];
    return { x, y, z }
  }
  
  get rotation(): Vector2 {
    const rotation = this._data.value.Rotation;
    if (rotation?.type !== TagType.List) return;
    const [x, y] = rotation.value.value as number[];
    return { x, y }
  }

  get health(): number | undefined {
    const health = this._data.value.Health;
    if (!health) return;
    return health.value as unknown as number;
  }

  get [Symbol.toStringTag]() {
    return this.typeId;
  }
}
