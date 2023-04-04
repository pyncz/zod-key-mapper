export type InferValue<T, FilterValue = string | number> = T extends Record<string, infer Value>
  ? Extract<Value, FilterValue>
  : never
