import { describe, it, expect } from 'vitest';
import { query, where, sort, groupBy, having } from '../src/query';
import { Group } from '../src/types';

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
];

describe('Лабораторная работа №4', () => {
  describe('where', () => {
    it('должен фильтровать по имени', () => {
      const w = where<User>()('name', 'Иван');
      const result = w(users);
      expect(result).toHaveLength(2);
      expect(result.every(u => u.name === 'Иван')).toBe(true);
    });
  });

  describe('sort', () => {
    it('должен сортировать по возрасту', () => {
      const s = sort<User>()('age');
      const result = s(users);
      expect(result[0].age).toBe(25);
      expect(result[3].age).toBe(35);
    });
  });

  describe('groupBy', () => {
    it('должен группировать по городу', () => {
      const g = groupBy<User>()('city');
      const result = g(users);
      expect(result).toHaveLength(3);
      const moscow = result.find(g => g.key === 'Москва');
      expect(moscow?.items).toHaveLength(2);
    });
  });

  describe('having', () => {
    it('должен фильтровать группы по количеству', () => {
      const g = groupBy<User>()('city');
      const h = having<User>()< 'city'>((group) => group.items.length > 1);
      const groups = g(users);
      const result = h(groups);
      expect(result).toHaveLength(1);
      expect(result[0].key).toBe('Москва');
    });
  });

  describe('query (комбинирование шагов)', () => {
    it('должен выполнять where и sort', () => {
      const pipeline = query<User>(
        where<User>()('name', 'Иван'),
        sort<User>()('age')
      );
      const result = pipeline(users);
      expect(result).toHaveLength(2);
      expect(result[0].age).toBe(30);
      expect(result[1].age).toBe(35);
    });

    it('должен выполнять groupBy и having', () => {
      const pipeline = query<User>(
        groupBy<User>()('city'),
        having<User>()< 'city'>((group) => group.items.length > 1)
      );
      const result = pipeline(users);
      expect(result).toHaveLength(1);
      expect(result[0].key).toBe('Москва');
    });

    it('должен выполнять полный конвейер: where, groupBy, having, sort', () => {
      const pipeline = query<User>(
        where<User>()('name', 'Иван'),
        groupBy<User>()('city'),
        having<User>()< 'city'>((group) => group.items.length >= 1),
        (groups: Group<User, 'city'>[]) => [...groups].sort((a, b) => {
          if (a.key < b.key) return -1;
          if (a.key > b.key) return 1;
          return 0;
        })
      );
      const result = pipeline(users);
      expect(result).toHaveLength(1);
      expect(result[0].key).toBe('Москва');
      expect(result[0].items.map(u => u.id)).toEqual([1, 3]);
    });
  });
});