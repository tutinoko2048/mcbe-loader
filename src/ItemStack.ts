import { Tags, TagType } from 'prismarine-nbt';
import { Enchantment } from './types';

type Data = Record<string, Tags[TagType]>;

export enum ItemLockMode {
  none = 'none',
  slot = 'slot',
  inventory = 'inventory'
}

export class ItemStack {
  public readonly _data: Data;
  constructor(data: Data) {
    this._data = data;
  }

  get isEmpty(): boolean {
    return !this.typeId;
  }

  get typeId(): string | undefined {
    return this._data.Name.value as string;
  }

  get amount(): number {
    return this._data.Count.value as number;
  }

  get data(): number {
    return this._data.Damage.value as number;
  }

  get nameTag(): string {
    return this._data.tag?.value?.['display']?.value?.Name?.value ?? '';
  }

  get lockMode(): ItemLockMode {
    const mode = this._data.tag?.value?.['minecraft:item_lock']?.value as number;
    if (!mode) return ItemLockMode.none;
    if (mode === 1) return ItemLockMode.slot;
    if (mode === 2) return ItemLockMode.inventory;
  }

  get keepOnDeath(): boolean {
    return !!this._data.tag?.value?.['minecraft:keep_on_death']?.value;
  }

  get durability(): number | undefined {
    return this._data.tag?.value?.['Damage']?.value;
  }

  get lore(): string[] {
    return this._data.tag?.value?.['display']?.value?.Lore?.value.value ?? [];
  }

  get enchantments(): Enchantment[] {
    const enchantmentList = this._data.tag?.value?.['ench']?.value?.value;
    if (!Array.isArray(enchantmentList)) return [];
    return enchantmentList.map(({ id, lvl }) => (
      { id: id.value, level: lvl.value }
    ));
  }

  toJSON() {
    return {
      typeId: this.typeId, amount: this.amount, data: this.data, nameTag: this.nameTag, lore: this.lore,
      lockMode: this.lockMode, keepOnDeath: this.keepOnDeath, durability: this.durability, enchantments: this.enchantments
    }
  }

  get [Symbol.toStringTag]() {
    return this.typeId;
  }
};
