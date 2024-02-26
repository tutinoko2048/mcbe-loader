import { Entity } from './entity/Entity';
import { Player } from './entity/Player';
import { DynamicPropertyUtil } from './world/DynamicProperty';
import type { World } from './world/World';

export async function processWorldData(world: World) {
  for (const keyValue of await world.db.getEntries()) {
    const { skey } = keyValue;

    if (skey.startsWith('actorprefix')) {
      if (!world.options.entity) return;
      const rawData = await keyValue.toNBT();
      if (rawData) world.entities.push(new Entity(rawData));

    } else if (skey.startsWith('player_') || skey === '~local_player') {
      if (!world.options.player) return;
      if (skey.includes('server') || skey === '~local_player') {
        world.players.push(new Player(await keyValue.toNBT()));
      }

    } else if (skey === 'scoreboard') {
      if (!world.options.scoreboard) return;
      world.scoreboard.load(await keyValue.toNBT());

    } else if (skey === 'DynamicProperties') {
      if (!world.options.dynamicProperty) return;
      Object.assign(world.dynamicProperties, DynamicPropertyUtil.load(await keyValue.toNBT()));

    } else if (skey.startsWith('structuretemplate_')) {
    } else if (skey.startsWith('digp')) {
    } else if (skey.startsWith('map_')) {
    } else if (skey.startsWith('VILLAGE')) {
    } else if (skey.startsWith('chunk_loaded_request')) {
    } else if (skey.startsWith('PosTrackDB')) {
    } else if (skey.startsWith('tickingarea_')) {
    } else if (skey.startsWith('portals')) {
    } else if (skey === 'PositionTrackDB-LastId') {
    } else if (skey === 'mobevents') {
    } else if (skey === 'BiomeData') {
    } else if (skey === 'Overworld') {
    } else if (skey === 'Nether') {
    } else if (skey === 'TheEnd') {
    } else if (skey === 'AutonomousEntities') {
    } else if (skey === 'LevelChunkMetaDataDictionary') {
    } else if (skey === 'schedulerWT') {
    } else if (
      keyValue.value &&
      [9, 10, 13, 14, 17, 18, 21, 22].includes(skey.length)
    ) {
      if (world.options.chunk) world.chunkManager._processKeyValue(keyValue);
    } else {
      console.warn('unknown key:', skey);
    }
  }
}