import { describe, it, expect } from 'vitest';
import {
  createUser,
  createBook,
  calculateArea,
  getStatusColor,
  capitalizeFirst,
  trimAndUppercase,
  getFirstElement,
  findById
} from './index';

// Задача 1
describe('createUser', () => {
  it('создаёт пользователя с обязательными полями', () => {
    const user = createUser(1, 'Alice');
    expect(user.id).toBe(1);
    expect(user.name).toBe('Alice');
    expect(user.isActive).toBe(true);
  });

  it('создаёт пользователя с email', () => {
    const user = createUser(2, 'roma', 'roma@mail.com');
    expect(user.email).toBe('roma@mail.com');
  });

  it('создаёт пользователя с isActive = false', () => {
    const user = createUser(3, 'Charlie', undefined, false);
    expect(user.isActive).toBe(false);
  });
});

// Задача 2
describe('createBook', () => {
  it('создаёт книгу', () => {
    const book = createBook({
      title: '1984',
      author: 'Orwell',
      genre: 'fiction'
    });
    expect(book.title).toBe('1984');
    expect(book.author).toBe('Orwell');
    expect(book.genre).toBe('fiction');
  });
});

// Задача 3
describe('calculateArea', () => {
  it('считает площадь круга', () => {
    const area = calculateArea('circle', 5);
    expect(area).toBeCloseTo(78.54, 1);
  });

  it('считает площадь квадрата', () => {
    const area = calculateArea('square', 4);
    expect(area).toBe(16);
  });
});

// Задача 4
describe('getStatusColor', () => {
  it('active -> green', () => {
    expect(getStatusColor('active')).toBe('green');
  });

  it('inactive -> gray', () => {
    expect(getStatusColor('inactive')).toBe('gray');
  });

  it('new -> blue', () => {
    expect(getStatusColor('new')).toBe('blue');
  });
});

// Задача 5
describe('capitalizeFirst', () => {
  it('делает первую букву заглавной', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
  });
});

describe('trimAndUppercase', () => {
  it('обрезает пробелы', () => {
    expect(trimAndUppercase('  hello  ')).toBe('hello');
  });

  it('делает заглавными если нужно', () => {
    expect(trimAndUppercase('  hello  ', true)).toBe('HELLO');
  });
});

// Задача 6
describe('getFirstElement', () => {
  it('возвращает первый элемент массива чисел', () => {
    expect(getFirstElement([1, 2, 3])).toBe(1);
  });

  it('возвращает первый элемент массива строк', () => {
    expect(getFirstElement(['a', 'b'])).toBe('a');
  });

  it('возвращает undefined для пустого массива', () => {
    expect(getFirstElement([])).toBeUndefined();
  });
});

// Задача 7
describe('findById', () => {
  const users = [
    { id: 1, name: 'Roma' },
    { id: 2, name: 'Taya' }
  ];

  it('находит пользователя по id', () => {
    expect(findById(users, 1)).toEqual({ id: 1, name: 'Roma' });
  });

  it('возвращает undefined если не найдено', () => {
    expect(findById(users, 999)).toBeUndefined();
  });
});