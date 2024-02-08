export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface Enchantment {
  id: number;
  level: number;
}

export enum Dimension {
  Overworld = 0,
  Nether = 1,
  TheEnd = 2
}