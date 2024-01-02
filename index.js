
// @ts-check
const fs = require('node:fs');
const nbt = require('prismarine-nbt');
const { LevelDB } = require('leveldb-zlib');
const { Player } = require('./src/Player');
const { Scoreboard } = require('./src/Scoreboard');

const worldFolder = 'sky';
const db = new LevelDB(`worlds/${worldFolder}/db`);

(async () => {
  await db.open();

  const players = await getPlayers();
  console.log('players:', players.length);
  const actualPlayers = new Set();
  const banned = new Set();

  for (const player of players) {
    actualPlayers.add(player.id);
    if (!player.dynamicProperties) continue;
    [
      'c225a904-422a-4917-b88d-5c3452b8d17f', // current TNAC
      'fcc8732d-300a-40e0-8a5d-613df2291a24' // old
    ].forEach(uuid => {
      const properties = player.dynamicProperties.getRegistry(uuid);
      const isBanned = properties?.get('tn:isBanned');
      isBanned && banned.add(player.id);
    });
  }
  console.log('banned:', banned.size)
  console.log('actualPlayers:', actualPlayers.size)

  const scoreboard = await getScoreboard();
  const users = scoreboard.getObjective('scoredb:users');
  console.log(users.getScores()[0])
})().catch(console.error);

async function getScoreboard() {
  const rawData = await get('scoreboard');
  return new Scoreboard(rawData.value);
}

/** @return {Promise<Player[]>} */
async function getPlayers() {
  const allKeys = await getAllKeys();
  console.log('keys:', allKeys.length);
  const infoKeys = allKeys
    .filter((k) => k.startsWith('player'))
    .filter((k) => !k.includes('server'));
  const promises = infoKeys.map(async (infoKey) => {
    const info = await get(infoKey);
    if (!info) return;
    return {
      data: (await get(info.value.ServerId?.value))?.value,
      info: info.value,
    };
  });

  const playersData = (await Promise.all(promises)).filter((d) => !!d?.data);
  const localPlayerData = (await get('~local_player'))?.value;
  playersData.push({ data: localPlayerData, info: undefined });
  return playersData.map((data) => new Player(data));
}

async function getAllKeys() {
  const keys = [];
  const iterator = db.getIterator({ keyAsBuffer: false });
  for await (const [key] of iterator) {
    keys.push(key);
  }
  return keys;
}
