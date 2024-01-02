const { Inventory } = require('./Inventory');
const { EquipmentInventory } = require('./EquipmentInventory');
const { DynamicPropertyManager } = require('./DynamicProperty')

/** @typedef {import('./types').Vector3} Vector3 */
/** @typedef {import('./types').Vector2} Vector2 */


class Player {
  #data;
  #info;
  #inventory;
  #enderChestInventory;
  #equipmentInventory;

  constructor(data) {
    this.#info = data.info;
    this.#data = data.data;
    this.#inventory = new Inventory(this.#data.Inventory.value.value);
    this.#enderChestInventory = new Inventory(this.#data.EnderChestInventory.value.value);
    this.#equipmentInventory = new EquipmentInventory(
      this.#data.Armor.value.value,
      this.#data.Mainhand.value.value,
      this.#data.Offhand.value.value
    );
  }
  

  get info() {
    if (!this.#info) return {}
    return Object.fromEntries(
      Object.entries(this.#info).map(([k,v]) => [k, v.value])
    )
  }
  
  /** @type {string} */
  get id() {
    return String(this.#data.UniqueID.value);
  }
  
  /** @type {string} */
  get tags() {
    return this.#data.Tags.value.value;
  }
  
  /** @type {Vector3} */
  get location() {
    const [x, y, z] = this.#data.Pos.value.value;
    return { x, y, z }
  }
  
  /** @type {Vector2} */
  get rotation() {
    const [x, y] = this.#data.Rotation.value.value;
    return { x, y }
  }
  
  /** @type {number} */
  get dimensionId() {
    return this.#data.DimensionId.value;
  }
  
  /** @type {number} */
  get gameMode() {
    return this.#data.PlayerGameMode.value;
  }
  
  /** @type {boolean} */
  get isOp() {
    return !!this.#data.abilities.value.op.value;
  }
  
  /** @type {number} */
  get permissionLevel() {
    return this.#data.abilities.value.permissionsLevel.value;
  }
  
  /** @type {number} */
  get playerPermissionLevel() {
    return this.#data.abilities.value.playerPermissionsLevel.value;
  }
  
  /** @type {Inventory} */
  get inventory() {
    return this.#inventory;
  }
  
  /** @type {Inventory} */
  get enderChestInventory() {
    return this.#enderChestInventory;
  }
  
  /** @type {EquipmentInventory} */
  get equipmentInventory() {
    return this.#equipmentInventory;
  }
  
  /** @type {number} */
  get level() {
    return this.#data.PlayerLevel.value;
  }

  get dynamicProperties() {
    if (!this.#data.DynamicProperties) return;
    return new DynamicPropertyManager(this.#data.DynamicProperties.value);
  }

  get rawData() { return this.#data }
  
  toJSON() {
    /** @type {(keyof Player)[]} */
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
}

module.exports = { Player }