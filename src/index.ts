import type { z } from 'zod'
import type { InferK, InferV, NonEmptyRecord, OmitEmpty } from './models'

export type Mapped<
  T extends Record<string, any>,
  M extends { [key in keyof T]?: string },
> = Omit<T, keyof OmitEmpty<M> | InferV<OmitEmpty<M>>>
& { [newKey in InferV<OmitEmpty<M>>]: InferK<M, newKey> extends keyof T ? T[InferK<M, newKey>] : never }

export const mapped = <
  T extends Record<string, any>,
  M extends Partial<Record<keyof T, string>>,
>(
    schema: z.ZodType<T, z.ZodTypeDef, any>,
    keysMap: keyof M extends keyof T ? NonEmptyRecord<M> : never,
  ): z.ZodType<Mapped<T, M>, z.ZodTypeDef, T> => {
  return schema.transform((data) => {
    const mappedData = {} as Mapped<T, M>

    for (const key in data) {
      const isOldKey = Object.keys(keysMap).includes(key)
      const isNewKey = Object.values(keysMap).includes(key)

      if (isOldKey && keysMap[key]) {
        mappedData[keysMap[key] as keyof Mapped<T, M>] = data[key]
      } else if (!isNewKey) {
        // Don't override the [newKey] field by the old data if the new key matches an already existing key
        mappedData[key as keyof Mapped<T, M>] = data[key]
      }
    }

    return mappedData
  })
}
