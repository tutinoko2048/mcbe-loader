import { writeFileSync } from 'fs';
import { BlockEntity, KeyBuilder, LevelKey, World, WorldChunkTag } from './src';

const world = new World('./worlds/sky', false);

async function main() {
  await world.open();
/*
u  const chunks = world.getChunks()
  for (const chunk of chunks) {
      const entities = (await chunk.getBlockEntities()).filter(e => ['Chest', 'Barrel'].includes(e.typeId));
      if (entities.length === 0) continue;
x.push(...entities.map(e => e._data.value.Items.value));
  }
  writeFileSync('output/containers.json', JSON.stringify(x, null, 2))*/
 // console.log(world.getChunk(0, 0).blockEntityKeys[0])
console.log(await world.getChunk(0, 0))
}
main().catch(console.error);
