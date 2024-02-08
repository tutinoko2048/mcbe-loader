import { NBT, parse, writeUncompressed } from 'prismarine-nbt';
import { readFile, stat, writeFile } from 'fs/promises';
import { resolve } from 'path';
import type { World } from './World';

export class LevelDat {
  public _data: NBT;
  constructor(
    public readonly world: World
  ) {}

  async load(): Promise<void> {
    const path = resolve(process.cwd(), this.world.db.worldPath, 'level.dat');
    const pathOld = resolve(process.cwd(), this.world.db.worldPath, 'level.dat_old');
    if (!(await stat(path)).isFile()) throw Error('level.dat not found');
    if (!(await stat(pathOld)).isFile()) throw Error('level.dat_old not found');
    
    const rawData = await readFile(path);
    const { parsed } = await parse(rawData);
    this._data = parsed;
  }

  async save(): Promise<void> {
    const path = resolve(process.cwd(), this.world.db.worldPath, 'level.dat');
    const pathOld = resolve(process.cwd(), this.world.db.worldPath, 'level.dat_old');
    await writeFile(path, writeUncompressed(this._data));
    await writeFile(pathOld, writeUncompressed(this._data));
  }
}