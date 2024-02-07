import { Player } from './Player';
import { InventorySlot } from './InventorySlot';
import { ItemStack } from './ItemStack';

export enum EquipmentSlot {
  Head = 'Head',
  Chest = 'Chest',
  Legs = 'Legs',
  Feet = 'Feet',
  Mainhand = 'Mainhand',
  Offhand = 'Offhand'
}

export class EquipmentInventory {
  private readonly armorSlots: InventorySlot[];
  private readonly mainHand: InventorySlot;
  private readonly offHand: InventorySlot;

  constructor(player: Player) {
    const armors = player._data.value?.['Armor'] as any;
    this.armorSlots = armors?.value?.value?.map(slot => new InventorySlot(slot));
    const mainHand = player._data.value?.['Mainhand'] as any;
    this.mainHand = new InventorySlot(mainHand?.value?.value[0]);
    const offHand = player._data.value?.['Offhand'] as any;
    this.offHand = new InventorySlot(offHand?.value?.value[0]);
  }

  getItem(slot: EquipmentSlot): ItemStack | undefined {
    let itemSlot: InventorySlot;
    switch (slot) {
      case EquipmentSlot.Head: itemSlot = this.armorSlots[0]; break;
      case EquipmentSlot.Chest: itemSlot = this.armorSlots[1]; break;
      case EquipmentSlot.Legs: itemSlot = this.armorSlots[2]; break;
      case EquipmentSlot.Feet: itemSlot = this.armorSlots[3]; break;
      case EquipmentSlot.Mainhand: itemSlot = this.mainHand; break;
      case EquipmentSlot.Offhand: itemSlot = this.offHand; break;
    }
    return itemSlot?.item;
  }
}