export class LevelKey {
  constructor(
    public buffer: Buffer
  ) {}

  get key(): string {
    return this.buffer.toString('utf-8');
  }

  get byteLength(): number {
    return this.buffer.byteLength;
  }

  get hex(): string {
    return this.buffer.toString('hex');
  }
}