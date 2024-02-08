import { writeFileSync } from 'fs';
import { World, WorldChunkTag } from './src';
import { BlockEntity } from './src/BlockEntity';

const world = new World('./worlds/seichi');

async function main() {
  await world.open();

  const chunks = await world.getChunks();
  for (const chunk of chunks.slice(0, 40)) {
    if (chunk.blockEntityKeys.length > 0) console.log(await chunk.getBlockEntities())
    //entities.push(...blockEntities.filter(e => e.typeId === undefined).map(e => e._data.value));
  }

  //writeFileSync('output/blockEntities.json', JSON.stringify(entities, null, 2));
  console.log(`chunks: ${world.chunkManager.totalChunks}, players: ${world.players.length}, entities: ${world.entities.length}`)
}
main().catch(console.error);
