import { writeFileSync } from 'fs';
import { World } from './src';

const world = new World('./worlds/map');

async function main() {
  await world.open();
  
  const players = await world.getPlayers();

  console.log(players.map(p => p.inventory.slots)[0])
  //const output = await world.db.get('DynamicProperties');
  //writeFileSync('output/player.json', JSON.stringify(x[0], null, 2));
}
main().catch(console.error);