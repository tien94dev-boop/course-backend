// src/common/utils/castObjectIds.ts
import { Types } from 'mongoose';

export function castObjectIdsInObject<T = any>(obj: any): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => castObjectIdsInObject(item)) as T;
  }
  if (typeof obj === 'object') {
    const result: any = {};

    for (const key in obj) {
      const value = obj[key];

      if (
        typeof value === 'string' &&
        key.endsWith('Id') &&
        value.length === 24 &&
        /^[0-9a-fA-F]{24}$/.test(value)
      ) {
        result[key] = new Types.ObjectId(value);
      } else {
        result[key] = castObjectIdsInObject(value);
      }
    }

    return result as T;
  }
  return obj;
}