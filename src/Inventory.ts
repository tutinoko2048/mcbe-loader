import { TagType, Tags } from 'prismarine-nbt';
import { InventorySlot } from './InventorySlot';
import { ItemStack } from './ItemStack';
import { Player } from './Player';

type Data = Tags[TagType.List];

export class Inventory {
  public readonly _data: Data;
  public readonly slots: InventorySlot[];

  constructor(player: Player) {
    this._data = player._data.value.Inventory as any;
    this.slots = this._data.value.value.map((slot: any) => new InventorySlot(slot));
  }

  get size() {
    return this.slots.length;
  }

  getItem(slot: number): ItemStack | undefined {
    return this.slots[slot]?.item;
  }

  getAllItems(): ItemStack[] {
    const items = [];
    for (let i = 0; i < this.size; i++) {
      items.push(this.getItem(i));
    }
    return items.filter(Boolean);
  }
}