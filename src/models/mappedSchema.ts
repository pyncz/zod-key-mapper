export type MappedSchema<
  T extends Record<string, any>,
  OldKey extends keyof T,
  NewKey extends string,
> = Omit<T, OldKey | NewKey> & Record<NewKey, T[OldKey]>
