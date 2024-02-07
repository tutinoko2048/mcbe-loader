import { NBT } from 'prismarine-nbt';
import { Vector3 } from './types';

export class BlockEntity {
  public readonly _data: NBT;

  constructor(data: NBT) {
    this._data = data;
  }

  get typeId(): string {
    return this._data.value.id?.value as string;
  }

  get location(): Vector3 {
    const x = this._data.value.x.value as number;
    const y = this._data.value.y.value as number;
    const z = this._data.value.z.value as number;
    return { x, y, z };
  }

  toJSON() {
    return {
      typeId: this.typeId, location: this.location
    }
  }

  get [Symbol.toStringTag]() {
    return this.typeId;
  }
}