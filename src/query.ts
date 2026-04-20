import { Transform, Group, GroupTransform } from './types';

export type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;

export type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;

export type GroupBy<T> = <K extends keyof T>(key: K) => Transform<Group<T, K>>;

export type Having<T> = <K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
) => GroupTransform<T, K>;

export function query<T>(...steps: (Transform<T> | Transform<any>)[]): Transform<T> {
  return (data: T[]) => {
    return steps.reduce((acc: any, step) => step(acc), data);
  };
}

export const where: <T>() => Where<T> = () => <K extends keyof T>(key: K, value: T[K]) =>
  (data: T[]) => data.filter(item => item[key] === value);

export const sort: <T>() => Sort<T> = () => <K extends keyof T>(key: K) =>
  (data: T[]) => [...data].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av < bv) return -1;
    if (av > bv) return 1;
    return 0;
  });

export const groupBy: <T>() => GroupBy<T> = () => <K extends keyof T>(key: K) =>
  (data: T[]) => {
    const groups = data.reduce((acc, item) => {
      const k = item[key] as unknown as string;
      (acc[k] ??= { key: item[key], items: [] }).items.push(item);
      return acc;
    }, {} as Record<string, Group<T, K>>);
    return Object.values(groups);
  };

export const having: <T>() => Having<T> = () => <K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
) => (groups: Group<T, K>[]) => groups.filter(predicate);