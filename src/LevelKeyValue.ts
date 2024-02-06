export class LevelKeyValue {
  constructor(
    public key: Buffer,
    public value: Buffer
  ) {}

  get skey(): string {
    return this.key.toString('utf-8');
  }

  get hexKey(): string {
    return this.key.toString('hex');
  }
}