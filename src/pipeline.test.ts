import { describe, it, expect } from 'vitest';
import { where, sort, groupBy, having, query } from './pipeline';

type User = {
  id: number;
  name: string;
  surname: string;
  age: number;
  city: string;
};

const users: User[] = [
  { id: 1, name: 'John', surname: 'Doe', age: 34, city: 'NY' },
  { id: 2, name: 'John', surname: 'Doe', age: 33, city: 'NY' },
  { id: 3, name: 'John', surname: 'Doe', age: 35, city: 'LA' },
  { id: 4, name: 'Mike', surname: 'Doe', age: 35, city: 'LA' },
];

describe('pipeline', () => {
  it('where фильтрует', () => {
    const result = where('name', 'John')(users);
    expect(result).toHaveLength(3);
  });

  it('sort сортирует по возрасту', () => {
    const result = sort('age')(users);
    expect(result.map(u => u.age)).toEqual([33, 34, 35, 35]);
  });

  it('groupBy группирует по городу', () => {
    const groups = groupBy('city')(users);
    expect(groups).toHaveLength(2);
    expect(groups.find(g => g.key === 'NY')?.items).toHaveLength(2);
  });

  it('having фильтрует группы', () => {
    const groups = groupBy('city')(users);
    const filtered = having((g: any) => g.items.length > 1)(groups);
    expect(filtered).toHaveLength(2);
  });

  it('query объединяет where + sort', () => {
    const q = query<User>(
      where('name', 'John'),
      where('surname', 'Doe'),
      sort('age')
    );
    const result = q(users);
    expect(result).toEqual([
      { id: 2, name: 'John', surname: 'Doe', age: 33, city: 'NY' },
      { id: 1, name: 'John', surname: 'Doe', age: 34, city: 'NY' },
      { id: 3, name: 'John', surname: 'Doe', age: 35, city: 'LA' },
    ]);
  });

  it('query с groupBy и having', () => {
    const q = query<User>(
      groupBy('city'),
      having((g: any) => g.items.some((u: User) => u.age > 34))
    );
    const result = q(users);
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('LA');
  });
});