export type StringifyObject<T> = { [K in keyof T]: T[K] extends object ? StringifyObject<T[K]> : string };

type JoinKeys<K, P> = K extends string | number ? (P extends string | number ? `${K}.${P}` : never) : never;

type IgnoreKeys = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]];

export type KeyPaths<T, D extends number = 10> = D extends never
  ? never
  : T extends object
    ? {
        [K in keyof T]: T[K] extends string
          ? K
          : T[K] extends object
            ? JoinKeys<K, KeyPaths<T[K], IgnoreKeys[D]>>
            : never;
      }[keyof T]
    : never;

export type ValueFromPath<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends keyof T[K]
      ? ValueFromPath<T[K], Rest>
      : ValueFromPath<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;
