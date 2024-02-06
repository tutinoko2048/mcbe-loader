import { writeFileSync } from 'fs';
import { World, WorldChunkTag } from './src';

const world = new World('./worlds/sky');

async function main() {
  await world.open();

  const chunks = await world.getChunks();
  for (const chunk of chunks.slice(0, 20)) {
    //console.log(chunk)
  }
  console.log(chunks.length);
  //writeFileSync('output/users.json', JSON.stringify(objectives, null, 2));
}
main().catch(console.error);
