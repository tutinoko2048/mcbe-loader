import { NBT, TagType, Tags } from 'prismarine-nbt';
import { Vector3 } from './types';

export type DynamicPropertiesCollection = Record<string, DynamicProperties>
export type DynamicProperties = Record<string, string | number | boolean | Vector3>

export class DynamicPropertyUtil {
  static parseData(data: Tags[TagType]): string | number | boolean {
    if (data.type === TagType.Byte) return !!data.value;
    if (data.type === TagType.Long) return String(data.value);
    return data.value as any;
  }

  static load(data?: NBT): DynamicPropertiesCollection {
    if (!data) return {};

    const collection = {}
    for (const [packUuid, properties] of Object.entries(data.value)) {
      const dynamicProperties = {};
      for (const [key, value] of Object.entries(properties.value)) {
        dynamicProperties[key] = DynamicPropertyUtil.parseData(value);
      }
      collection[packUuid] = dynamicProperties;
    }
    return collection;
  }
}

