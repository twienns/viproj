import { Transform, Group, GroupTransform } from './types.js';

const pipe = <T>(...fns: Transform<T>[]): Transform<T> =>
  (data) => fns.reduce((acc, fn) => fn(acc), data);

const pipeGroups = <T, K extends keyof T>(
  ...fns: GroupTransform<T, K>[]
): GroupTransform<T, K> =>
  (groups) => fns.reduce((acc, fn) => fn(acc), groups);

export interface WhereBuilder<T> {
  where: <K extends keyof T>(key: K, value: T[K]) => WhereBuilder<T>;
  groupBy: <K extends keyof T>(key: K) => GroupByBuilder<T, K>;
  run: (data: T[]) => T[];
}

export interface GroupByBuilder<T, K extends keyof T> {
  having: (predicate: (group: Group<T, K>) => boolean) => HavingBuilder<T, K>;
  run: (data: T[]) => Group<T, K>[];
}

export interface HavingBuilder<T, K extends keyof T> {
  having: (predicate: (group: Group<T, K>) => boolean) => HavingBuilder<T, K>;
  sort: <S extends keyof Group<T, K>>(key: S) => SortBuilder<Group<T, K>>;
  run: (data: T[]) => Group<T, K>[];
}

export interface SortBuilder<T> {
  sort: <K extends keyof T>(key: K) => SortBuilder<T>;
  run: (data: T[]) => T[];
}

class WhereBuilderImpl<T> implements WhereBuilder<T> {
  private transforms: Transform<T>[] = [];

  where<K extends keyof T>(key: K, value: T[K]): WhereBuilder<T> {
    this.transforms.push((data) => data.filter(item => item[key] === value));
    return this;
  }

  groupBy<K extends keyof T>(key: K): GroupByBuilder<T, K> {
    const groupTransform: Transform<Group<T, K>> = (data) => {
      const groups = data.reduce((acc, item) => {
        const k = item[key] as unknown as string;
        (acc[k] ??= { key: item[key], items: [] }).items.push(item);
        return acc;
      }, {} as Record<string, Group<T, K>>);
      return Object.values(groups);
    };
    const preGroup = pipe(...this.transforms);
    const fullTransform: Transform<Group<T, K>> = (data) => groupTransform(preGroup(data));
    return new GroupByBuilderImpl(fullTransform);
  }

  run(data: T[]): T[] {
    return pipe(...this.transforms)(data);
  }
}

class GroupByBuilderImpl<T, K extends keyof T> implements GroupByBuilder<T, K> {
  private groupTransforms: GroupTransform<T, K>[] = [];

  constructor(private baseTransform: Transform<Group<T, K>>) {}

  having(predicate: (group: Group<T, K>) => boolean): HavingBuilder<T, K> {
    this.groupTransforms.push((groups) => groups.filter(predicate));
    return new HavingBuilderImpl(this.baseTransform, this.groupTransforms);
  }

  run(data: T[]): Group<T, K>[] {
    return pipeGroups(...this.groupTransforms)(this.baseTransform(data));
  }
}

class HavingBuilderImpl<T, K extends keyof T> implements HavingBuilder<T, K> {
  constructor(
    private baseTransform: Transform<Group<T, K>>,
    private groupTransforms: GroupTransform<T, K>[]
  ) {}

  having(predicate: (group: Group<T, K>) => boolean): HavingBuilder<T, K> {
    this.groupTransforms.push((groups) => groups.filter(predicate));
    return this;
  }

  sort<S extends keyof Group<T, K>>(key: S): SortBuilder<Group<T, K>> {
    const sortTransform: Transform<Group<T, K>> = (groups) =>
      [...groups].sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        return av < bv ? -1 : av > bv ? 1 : 0;
      });
    const fullTransform: Transform<Group<T, K>> = (data) =>
      sortTransform(pipeGroups(...this.groupTransforms)(this.baseTransform(data)));
    return new SortBuilderImpl(fullTransform);
  }

  run(data: T[]): Group<T, K>[] {
    return pipeGroups(...this.groupTransforms)(this.baseTransform(data));
  }
}

class SortBuilderImpl<T> implements SortBuilder<T> {
  constructor(private transform: Transform<T>) {}

  sort<K extends keyof T>(key: K): SortBuilder<T> {
    const sortTransform: Transform<T> = (data) =>
      [...data].sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        return av < bv ? -1 : av > bv ? 1 : 0;
      });
    return new SortBuilderImpl(pipe(this.transform, sortTransform));
  }

  run(data: T[]): T[] {
    return this.transform(data);
  }
}

export function createQuery<T>(): WhereBuilder<T> {
  return new WhereBuilderImpl<T>();
}