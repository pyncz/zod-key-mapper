export type InferV<T, V = string | number> = T extends Record<string, infer Value>
  ? Extract<Value, V>
  : never

export type InferK<T, V> = T extends Record<infer Key, infer Value>
  ? Value extends V ? Key : never
  : never
