import { writeFileSync } from 'fs';
import { World } from './src';

const world = new World('./worlds/map');

async function main() {
  await world.open();

  const chunks = await world.getChunks();
  for (const chunk of chunks.slice(0, 40)) {
  }

  //writeFileSync('output/blockEntities.json', JSON.stringify(entities, null, 2));
  console.log(world.levelDat._data.value);
  //world.levelDat._data.value.playerPermissionsLevel.value = 4;
  //await world.levelDat.save();

  console.log(`chunks: ${world.chunkManager.totalChunks}, players: ${world.players.length}, entities: ${world.entities.length}`)
}
main().catch(console.error);
