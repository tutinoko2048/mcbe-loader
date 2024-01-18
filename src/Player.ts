import { NBT } from 'prismarine-nbt';
import { Entity } from './Entity';
import { Inventory } from './Inventory';
import { EquipmentInventory } from './EquipmentInventory';

export class Player extends Entity {
  public readonly inventory: Inventory;
  public readonly equipmentInventory: EquipmentInventory;

  constructor(data: NBT) {
    super(data);

    this.inventory = new Inventory(this);
    this.equipmentInventory = new EquipmentInventory(this);
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