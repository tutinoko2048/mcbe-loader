
import { World, EquipmentSlot } from './src';

const world = new World('./worlds/sky');

async function main() {
  await world.open();
  console.log(world.dynamicProperties)

  const players = await world.getPlayers()
  for (const player of players) {
    if (Object.keys(player.dynamicProperties).length > 0) console.log(player.dynamicProperties);
  }

  //writeFileSync('output/users.json', JSON.stringify(objectives, null, 2));
}
main().catch(console.error);
