import { writeFileSync } from 'fs';
import { World } from './src';

const world = new World('./worlds/SeichiServer4th');

async function main() {
  await world.open();

  const obj = world.scoreboard.getObjective('mine');
  console.log(world.scoreboard.getParticipants().map(x => x.toJSON()))
  //console.log(world.scoreboard.getObjectives().map(x => []))


  //const output = await world.db.get('DynamicProperties');
 // writeFileSync('output/output.json', JSON.stringify(output, null, 2));
}
main().catch(console.error);