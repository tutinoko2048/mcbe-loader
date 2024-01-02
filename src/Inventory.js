const { ItemStack } = require('./ItemStack');

exports.Inventory = class Inventory {
  #data;
  constructor(data) {
    this.#data = data;
  }
  
  /** 
   * @param {number} slot
   * @returns {ItemStack | undefined}
   */
  getItem(slot) {
    let itemData = this.#data[slot];
    if (itemData && itemData.Slot.value !== slot) itemData = this.#data.find(x => x.Slot.value === slot);
    if (
      itemData &&
      itemData.Name.value !== '' &&
      itemData.Count.value > 0
    ) return new ItemStack(itemData);
  }
  
  /** @type {number} */
  get size() {
    return this.#data.length;
  }
}