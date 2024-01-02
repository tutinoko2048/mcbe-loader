const { ItemStack } = require('./ItemStack');

/** @enum {'Head'|'Chest'|'Legs'|'Feet'|'Mainhand'|'Offhand'} */
const EquipmentSlot = /** @type {const} */({
  Head: 'Head',
  Chest: 'Chest',
  Legs: 'Legs',
  Feet: 'Feet',
  Mainhand: 'Mainhand',
  Offhand: 'Offhand'
});
exports.EquipmentSlot = EquipmentSlot;

exports.EquipmentInventory = class EquipmentInventory {
  #armor;
  #mainHand;
  #offHand;
  constructor(armor, mainHand, offHand) {
    this.#armor = armor;
    this.#mainHand = mainHand;
    this.#offHand = offHand;
  }
  
  /** 
   * @param {EquipmentSlot} slot
   * @returns {ItemStack | undefined}
   */
  getItem(slot) {
    let itemData;
    switch (slot) {
      case EquipmentSlot.Head: itemData = this.#armor[0]; break;
      case EquipmentSlot.Chest: itemData = this.#armor[1]; break;
      case EquipmentSlot.Legs: itemData = this.#armor[2]; break;
      case EquipmentSlot.Feet: itemData = this.#armor[3]; break;
      case EquipmentSlot.Mainhand: itemData = this.#mainHand[0]; break;
      case EquipmentSlot.Offhand: itemData = this.#offHand[0]; break;
    }
    if (
      itemData &&
      itemData.Name.value !== '' &&
      itemData.Count.value > 0
    ) return new ItemStack(itemData);
  }
}