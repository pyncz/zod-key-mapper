# @pyncz/zod-key-mapper

🗝️ Transform keys of [zod](https://github.com/colinhacks/zod) object schemas

---

## Installation

Just install it with your favourite package manager:
```sh
pnpm install @pyncz/zod-key-mapper
```

## Usage

Let's say, you use a 3rd party API to fetch some data. You want to parse and transform it with zod for further usage, including some operations with keys, e.g. mapping keys from *snake_case* to *camelCase*, or even change some confusing field names into something more convenient.

`@pyncz/zod-key-mapper` provides a convenient way to transform keys:

```ts
import { z } from 'zod'
import { mapped } from '@pyncz/zod-key-mapper'

const schema = mapped(z.object({
  snake_case_field: z.string(),
  foo: z.number(),
  bar: z.number(),
}), { snake_case_field: 'weRespectCamelsHere' })

console.log(schema.parse({ snake_case_field: 'hey', foo: 69, bar: 420 }))
// > { weRespectCamelsHere: 'hey', foo: 69, bar: 420 }
```

You can map multiple keys:
```ts
const schema = mapped(z.object({
  key1: z.string(),
  key2: z.number(),
  key3: z.number(),
}), { key1: 'key1mod', key2: 'key2mod' })

console.log(schema.parse({ key1: 'hey', key2: 69, key3: 420 }))
// > { key1mod: 'hey', key2mod: 69, key3: 420 }
```

Or you can map the schema key by key:
```ts
const schema = mapped(mapped(z.object({
  key1: z.string(),
  key2: z.number(),
  key3: z.number(),
}), { key1: 'key1mod' }), { key2: 'key2mod' })

console.log(schema.parse({ key1: 'hey', key2: 69, key3: 420 }))
// > { key1mod: 'hey', key2mod: 69, key3: 420 }
```

#### Arguments
- `schema` - your Zod type
- `keysMap` - a readonly object with **keys you want to rename** as keys, and **corresponding new keys** as values.

## What's up with other keys operations?

> "What if I want to add or remove keys, not just transform them?"

Well, you should use [pick / omit](https://zod.dev/?id=pickomit) methods zod provides out of the box, before mapping:

```ts
const schema = mapped(z.object({
  key1: z.string(),
  key2: z.number(),
  key3: z.number(),
}).pick({ key1: true }), { key1: 'key1mod' })

console.log(schema.parse({ key1: 'hey', key2: 69, key3: 420 }))
// > { key1mod: 'hey' }
```
