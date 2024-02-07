import { NBT, parse } from 'prismarine-nbt';

export class LevelKey {
  constructor(
    public readonly key: Buffer
  ) {}

  get skey(): string {
    return this.key.toString('utf-8');
  }

  get hexKey(): string {
    return this.key.toString('hex');
  }
}

export class LevelKeyValue extends LevelKey {
  constructor(
    key: Buffer,
    public readonly value?: Buffer
  ) {
    super(key);
  }

  async toNBT(): Promise<NBT | undefined> {
    if (!this.value) return;
    const { parsed } = await parse(this.value);
    return parsed;
  }
}
