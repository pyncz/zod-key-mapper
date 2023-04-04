import { describe, expect, test } from 'vitest'
import { z } from 'zod'
import { inputObject } from './test'
import { mapped } from '.'

describe.concurrent('transform keys', () => {
  const originalSchema = z.object({
    key1: z.string(),
    key2: z.number(),
    key3: z.number(),
  })

  test('should parse the original schema without mapping', async () => {
    const parsed = originalSchema.parse(inputObject)
    expect(parsed).toMatchObject(inputObject)
  })

  test('should parse a schema with a mapped key', async () => {
    const mappedSchema = mapped(originalSchema, 'key1', 'key1mod')
    const parsed = mappedSchema.parse(inputObject)
    expect(parsed).toMatchObject({
      key1mod: 'hey',
      key2: 69,
      key3: 420,
    })
  })

  test('should parse a schema with multiple mapped keys', async () => {
    const mappedSchema = mapped(mapped(originalSchema, 'key1', 'key1mod'), 'key2', 'key2mod')
    const parsed = mappedSchema.parse(inputObject)
    expect(parsed).toMatchObject({
      key1mod: 'hey',
      key2mod: 69,
      key3: 420,
    })
  })

  test('should parse a schema with a key mapped multiple times', async () => {
    const mappedSchema = mapped(mapped(originalSchema, 'key1', 'key1mod'), 'key1mod', 'key1mod2x')
    const parsed = mappedSchema.parse(inputObject)
    expect(parsed).toMatchObject({
      key1mod2x: 'hey',
      key2: 69,
      key3: 420,
    })
  })

  test('should override an existing subsequent key if a new one is mapped into it', async () => {
    const mappedSchema = mapped(originalSchema, 'key1', 'key2')
    const parsed = mappedSchema.parse(inputObject)
    expect(parsed).toMatchObject({
      key2: 'hey',
      key3: 420,
    })
  })

  test('should override an existing preceding key if a new one is mapped into it', async () => {
    const mappedSchema = mapped(originalSchema, 'key2', 'key1')
    const parsed = mappedSchema.parse(inputObject)
    expect(parsed).toMatchObject({
      key1: 69,
      key3: 420,
    })
  })

  test('should keep the same schema if a key is mapped into itself', async () => {
    const mappedSchema = mapped(originalSchema, 'key2', 'key2')
    const parsed = mappedSchema.parse(inputObject)
    expect(parsed).toMatchObject(inputObject)
  })

  test('should throw a *runtime* exception if the key\'s new name is an empty string', async () => {
    // NOTE: Ignore ts checks it order to test runtime exceptions
    // @ts-expect-error Argument of type 'string' is not assignable to parameter of type 'never'.
    expect(() => mapped(originalSchema, 'key1', '')).toThrowError()
  })
})
