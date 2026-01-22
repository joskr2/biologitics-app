export type ReadonlyProps<T> = T & { readonly [K in keyof T]: T[K] };
