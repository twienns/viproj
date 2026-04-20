export type Transform<T> = (data: T[]) => T[];

export type Group<T, K extends keyof T> = {
  key: T[K];
  items: T[];
};

export type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];