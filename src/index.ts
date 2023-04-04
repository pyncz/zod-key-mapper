import type { z } from 'zod'
import type { MappedSchema } from './models'

export const mapped = <
  T extends Record<string, any>,
  OldKey extends keyof T,
  NewKey extends string,
>(
    schema: z.ZodType<T, z.ZodTypeDef, any>,
    oldKey: OldKey,
    newKey: NewKey extends '' ? never : NewKey,
  ): z.ZodType<MappedSchema<T, OldKey, NewKey>, z.ZodTypeDef, T> => {
  if (!newKey) {
    throw new Error('The mapped key\'s name cannot be an empty string!')
  }

  return schema.transform((data) => {
    const mappedData = {} as MappedSchema<T, OldKey, NewKey>

    for (const k in data) {
      const key = k as keyof T
      if (key === oldKey) {
        mappedData[newKey as keyof MappedSchema<T, OldKey, NewKey>] = data[key]
      } else {
        mappedData[key as keyof MappedSchema<T, OldKey, NewKey>] = data[key]
      }
    }
    return mappedData
  })
}
