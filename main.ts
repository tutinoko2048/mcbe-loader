import { World, EquipmentSlot } from './src';

const world = new World('./worlds/seichi');

async function main() {
  await world.open();
  const players = await world.getPlayers();
  console.log(world.dynamicProperties)
  for (const player of players) {
    const x = player.equipmentInventory.getItem(EquipmentSlot.Legs)
    if (x) {
      console.log(x.toJSON())
      break;
    } 
  }

  //writeFileSync('output/users.json', JSON.stringify(objectives, null, 2));
}
main().catch(console.error);
