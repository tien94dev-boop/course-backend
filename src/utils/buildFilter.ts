import { FilterQuery } from 'mongoose';
import { castObjectIdsInObject } from '@/common/utils/castObjectIds';

type AnyObject = Record<string, any>;

export function buildFilter<T = any>(query: AnyObject): FilterQuery<T> {
  const castQuery = castObjectIdsInObject(query);
  const filter: AnyObject = {};

  for (const key in castQuery) {
    const value = castQuery[key];

    if (value === undefined || value === null || value === '') continue;

    // field_operator
    const match = key.match(/(.+?)_(regex|in|nin|gt|gte|lt|lte)$/);

    if (match) {
      const [, field, operator] = match;

      if (!filter[field]) filter[field] = {};

      switch (operator) {
        case 'regex':
          filter[field] = {
            $regex: value,
            $options: 'i',
          };
          break;

        case 'in':
          filter[field].$in = Array.isArray(value) ? value : [value];
          break;

        case 'nin':
          filter[field].$nin = Array.isArray(value) ? value : [value];
          break;

        case 'gt':
        case 'gte':
        case 'lt':
        case 'lte':
          filter[field][`$${operator}`] = value;
          break;
      }
    } else {
      // mặc định là $eq
      filter[key] = value;
    }
  }

  return filter;
}
