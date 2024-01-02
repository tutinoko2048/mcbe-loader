import { writeFileSync } from 'fs';
import { World } from './src';

const world = new World('./worlds/test');

async function main() {
  const scoreboard = await world.db.get('scoreboard');
  const _keys = await world.db.getAllKeys()
  const keys = _keys.map(k => k);
  const output = await world.db.get('DynamicProperties');
  writeFileSync('worlds/output.json', JSON.stringify(scoreboard, null, 2))
}
main().catch(console.error);