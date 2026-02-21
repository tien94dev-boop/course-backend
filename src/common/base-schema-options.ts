// src/common/base-schema-options.ts
import { SchemaOptions } from 'mongoose';

export function createBaseSchemaOptions(
  options?: { timestamps?: boolean }
): SchemaOptions {
  const { timestamps = true } = options || {};

  return {
    timestamps,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc: any, ret: any) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc: any, ret: any) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  };
}
