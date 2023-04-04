export type OmitEmpty<T> = {
  [key in keyof T as T[key] extends '' ? never : key]: T[key]
}

export type NonEmptyRecord<T> = {
  [key in keyof T]: T[key] extends '' ? never : T[key]
}
