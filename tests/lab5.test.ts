import { describe, it, expect } from 'vitest';
import { query } from '../src/query.js';

type User = {
  id: number;
  name: string;
  surname: string;
  age: number;
  city: string;
};

const users: User[] = [
  { id: 1, name: 'Иван', surname: 'Петров', age: 30, city: 'Москва' },
  { id: 2, name: 'Пётр', surname: 'Иванов', age: 25, city: 'Санкт-Петербург' },
  { id: 3, name: 'Иван', surname: 'Сидоров', age: 35, city: 'Москва' },
  { id: 4, name: 'Анна', surname: 'Петрова', age: 28, city: 'Казань' },
  { id: 5, name: 'Иван', surname: 'Петров', age: 40, city: 'Москва' },
];

describe('Лабораторная работа №5 (поведение)', () => {
  it('where фильтрует', () => {
    const res = query<User>().where('name', 'Иван').run(users);
    expect(res).toHaveLength(3);
  });

  it('groupBy группирует', () => {
    const res = query<User>().groupBy('city').run(users);
    expect(res).toHaveLength(3);
    expect(res.find(g => g.key === 'Москва')?.items.length).toBe(3);
  });

  it('having фильтрует группы', () => {
    const res = query<User>()
      .groupBy('city')
      .having(g => g.items.length > 2)
      .run(users);
    expect(res).toHaveLength(1);
    expect(res[0].key).toBe('Москва');
  });

  it('sort сортирует группы (после having)', () => {
    const res = query<User>()
      .groupBy('city')
      .having(() => true) 
      .sort('key')
      .run(users);
    const keys = res.map(g => g.key);
    const sorted = [...keys].sort();
    expect(keys).toEqual(sorted);
  });

  it('полный конвейер where → groupBy → having → sort', () => {
    const res = query<User>()
      .where('surname', 'Петров')
      .groupBy('city')
      .having(g => g.items.length >= 1)
      .sort('key')
      .run(users);
    expect(res).toHaveLength(1);
    expect(res[0].key).toBe('Москва');
    expect(res[0].items.map(u => u.id)).toEqual([1, 5]);
  });
});