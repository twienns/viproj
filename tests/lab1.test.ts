import { describe, it, expect } from 'vitest';
import {
  createUser,
  calculateArea,
  getStatusColor,
  capitalizeFirst,
  trimAndUpperCase,
  getFirstElement,
  findById,
} from '../src/lab1';

describe('Лабораторная работа №1', () => {
  describe('createUser', () => {
    it('должен создавать пользователя с указанными полями', () => {
      const user = createUser(1, 'Иван', 'ivan@mail.ru', true);
      expect(user).toEqual({
        id: 1,
        name: 'Иван',
        email: 'ivan@mail.ru',
        isActive: true,
      });
    });

    it('должен устанавливать isActive в true по умолчанию', () => {
      const user = createUser(2, 'Пётр');
      expect(user.isActive).toBe(true);
    });

    it('должен корректно обрабатывать отсутствие email', () => {
      const user = createUser(3, 'Анна', undefined, false);
      expect(user.email).toBeUndefined();
    });
  });

  describe('calculateArea', () => {
    it('должен вычислять площадь круга', () => {
      const radius = 5;
      const expected = Math.PI * radius * radius;
      expect(calculateArea('circle', radius)).toBeCloseTo(expected);
    });

    it('должен вычислять площадь квадрата', () => {
      const side = 4;
      expect(calculateArea('square', side)).toBe(16);
    });
  });

  describe('getStatusColor', () => {
    it('должен возвращать "green" для "active"', () => {
      expect(getStatusColor('active')).toBe('green');
    });

    it('должен возвращать "red" для "inactive"', () => {
      expect(getStatusColor('inactive')).toBe('red');
    });

    it('должен возвращать "blue" для "new"', () => {
      expect(getStatusColor('new')).toBe('blue');
    });
  });

  describe('capitalizeFirst', () => {
    it('должен делать первую букву заглавной', () => {
      expect(capitalizeFirst('привет')).toBe('Привет');
    });

    it('должен приводить к верхнему регистру при uppercase=true', () => {
      expect(capitalizeFirst('привет', true)).toBe('ПРИВЕТ');
    });

    it('не должен изменять регистр остальных букв без uppercase', () => {
      expect(capitalizeFirst('пРИВЕТ')).toBe('ПРИВЕТ');
    });
  });

  describe('trimAndUpperCase', () => {
    it('должен удалять пробелы в начале и конце', () => {
      expect(trimAndUpperCase('  hello  ')).toBe('hello');
    });

    it('должен приводить к верхнему регистру при uppercase=true', () => {
      expect(trimAndUpperCase('  hello  ', true)).toBe('HELLO');
    });

    it('не должен менять регистр без uppercase', () => {
      expect(trimAndUpperCase('  HeLLo  ')).toBe('HeLLo');
    });
  });

  describe('getFirstElement', () => {
    it('должен возвращать первый элемент непустого массива', () => {
      expect(getFirstElement([10, 20, 30])).toBe(10);
      expect(getFirstElement(['a', 'b', 'c'])).toBe('a');
    });

    it('должен возвращать undefined для пустого массива', () => {
      expect(getFirstElement([])).toBeUndefined();
    });

    it('должен работать с массивом объектов', () => {
      const arr = [{ id: 1 }, { id: 2 }];
      expect(getFirstElement(arr)).toEqual({ id: 1 });
    });
  });

  describe('findById', () => {
    interface HasId {
      id: number;
    }
    const items: (HasId & { name: string })[] = [
      { id: 1, name: 'Иван' },
      { id: 2, name: 'Пётр' },
      { id: 3, name: 'Анна' },
    ];

    it('должен находить объект по существующему id', () => {
      const result = findById(items, 2);
      expect(result).toEqual({ id: 2, name: 'Пётр' });
    });

    it('должен возвращать undefined для несуществующего id', () => {
      const result = findById(items, 99);
      expect(result).toBeUndefined();
    });

    it('должен работать с массивом, содержащим только поле id', () => {
      const simple = [{ id: 10 }, { id: 20 }];
      expect(findById(simple, 20)).toEqual({ id: 20 });
    });
  });
});