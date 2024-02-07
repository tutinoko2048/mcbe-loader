import { TagType, Tags } from 'prismarine-nbt';
import { ItemStack } from './ItemStack';

type Data = Record<string, Tags[TagType.Compound]>;

export class InventorySlot {
  public readonly _data: Data;
  constructor(data: Data) {
    this._data = data;
  }

  get item(): ItemStack | undefined {
    const itemStack = new ItemStack(this._data);
    if (!itemStack.isEmpty) return itemStack;
  }
}