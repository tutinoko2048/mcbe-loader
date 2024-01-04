import { NBT, TagType } from 'prismarine-nbt';
import { Entity } from './Entity';
import { Inventory } from './Inventory';

export class Player extends Entity {
  public readonly inventory: Inventory;
  /*
  #info;
  #inventory;
  #enderChestInventory;
  #equipmentInventory;
*/
  constructor(data: NBT) {
    super(data);

    const inventory = this._data.value.Inventory;
    if (inventory?.type !== TagType.List || inventory.value.type !== TagType.Compound) return;
    this.inventory = new Inventory(inventory);
    /*
    this.#enderChestInventory = new Inventory(this.#data.EnderChestInventory.value.value);
    this.#equipmentInventory = new EquipmentInventory(
      this.#data.Armor.value.value,
      this.#data.Mainhand.value.value,
      this.#data.Offhand.value.value
    );
    */
  }

  /*  
    
  get dimensionId() {
    return this._data.DimensionId.value;
  }
  
  get gameMode() {
    return this._data.PlayerGameMode.value;
  }
  
  get isOp() {
    return !!this._data.abilities.value.op.value;
  }
  
  get permissionLevel() {
    return this._data.abilities.value.permissionsLevel.value;
  }
  
  get playerPermissionLevel() {
    return this._data.abilities.value.playerPermissionsLevel.value;
  }
  
  get inventory() {
    return this.#inventory;
  }
  
    
  get level() {
    return this._data.PlayerLevel.value;
  }

  
  toJSON() {
    const valueList = [
      'id',
      'location',
      'rotation',
      'dimensionId',
      'isOp',
      'tags',
      'permissionLevel',
      'playerPermissionLevel',
      'level',
    ]
    return Object.fromEntries(valueList.map(k => [k, this[k]]));
  }
  **/
}

module.exports = { Player }