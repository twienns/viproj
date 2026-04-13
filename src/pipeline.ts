export type Transform<T> = (data: T[]) => T[];

export type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;

export type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;

export interface Group<T, K extends keyof T> {
  key: T[K];
  items: T[];
}

export type GroupBy<T> = <K extends keyof T>(key: K) => Transform<Group<T, K>>;

export type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];

export type Having<T> = <K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
) => GroupTransform<T, K>;

export const where: Where<any> = (key, value) => (data) =>
  data.filter((item) => item[key] === value);

export const sort: Sort<any> = (key) => (data) =>
  [...data].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av < bv) return -1;
    if (av > bv) return 1;
    return 0;
  });

export const groupBy: GroupBy<any> = (key) => (data) => {
  const groupsMap = new Map<any, Group<any, any>>();
  for (const item of data) {
    const groupKey = item[key];
    if (!groupsMap.has(groupKey)) {
      groupsMap.set(groupKey, { key: groupKey, items: [] });
    }
    groupsMap.get(groupKey)!.items.push(item);
  }
  return Array.from(groupsMap.values());
};

export const having: Having<any> = (predicate) => (groups) =>
  groups.filter(predicate);

export function query<T>(
  ...steps: Array<(data: any) => any>
): Transform<T> {
  return (initialData: T[]) => {
    let result: any = initialData;
    for (const step of steps) {
      result = step(result);
    }
    return result as T[];
  };
}