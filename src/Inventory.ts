import { TagType, Tags } from 'prismarine-nbt';

type Data = Tags[TagType.List]

export class Inventory {
  public _data: Data;
  public slots: any[];

  constructor(data: Data) {
    this._data = data;

    this.slots = this._data.value.value.map(item => item);
  }

  /*
  getItem(slot) {
    let itemData = this._data[slot];
    if (itemData && itemData.Slot.value !== slot) itemData = this.#data.find(x => x.Slot.value === slot);
    if (
      itemData &&
      itemData.Name.value !== '' &&
      itemData.Count.value > 0
    ) return new ItemStack(itemData);
  }
  
  get size() {
    return this.#data.length;
  }
  */
}