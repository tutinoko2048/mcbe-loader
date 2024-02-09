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
    const baseData = writeUncompressed(this._data, 'little');
    const fixedData = this.fixLevelDat(baseData);
    await writeFile(path, fixedData);
    await writeFile(pathOld, fixedData);
  }

  /** Add extra 8 bytes as header */
  private fixLevelDat(dat: Buffer): Buffer {
    // file type
    const fileType = 10;
    const fileTypeData = Buffer.alloc(4, 0);
    fileTypeData.writeInt32LE(fileType);

    // size of level.dat
    const sizeData = Buffer.alloc(4, 0);
    sizeData.writeInt32LE(dat.byteLength);

    // merge it
    return Buffer.concat([fileTypeData, sizeData, dat]);
  }
}