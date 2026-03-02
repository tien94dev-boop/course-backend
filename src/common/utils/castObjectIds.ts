import { Types } from 'mongoose';

export function castObjectIdsInObject<T = any>(obj: any): T {
  if (obj === null || obj === undefined) return obj;

  // Ép kiểu về 'any' trước khi trả về để đánh lừa TS rằng nó khớp với T
  if (obj instanceof Types.ObjectId || obj instanceof Date) return obj as any;

  if (Array.isArray(obj)) {
    return obj.map(item => castObjectIdsInObject(item)) as any;
  }

  if (typeof obj === 'object') {
    // Chỉ xử lý Plain Object, bỏ qua các Class instance khác (như Mongoose Doc)
    if (obj.constructor && obj.constructor.name !== 'Object') return obj as any;

    const result: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (
        typeof value === 'string' &&
        (key.endsWith('Id') || key === '_id') && 
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