import { describe, it, vi, expect, beforeEach } from 'vitest';
import { csvToJSON } from './csv';

describe('csvToJSON', () => {
  it('корректно преобразует CSV с числами и строками', () => {
    const input = ['p1;p2;p3;p4', '1;A;b;c', '2;B;v;d'];
    const result = csvToJSON(input, ';');
    expect(result).toEqual([
      { p1: 1, p2: 'A', p3: 'b', p4: 'c' },
      { p1: 2, p2: 'B', p3: 'v', p4: 'd' },
    ]);
  });

  it('пустой массив возвращает пустой массив', () => {
    expect(csvToJSON([], ';')).toEqual([]);
  });

  it('выбрасывает ошибку при несовпадении количества полей', () => {
    const input = ['a;b', '1;2;3'];
    expect(() => csvToJSON(input, ';')).toThrowError(/Несовпадение количества полей/);
  });

  it('преобразует числовые строки в числа', () => {
    const input = ['id;value', '42;3.14', '100;abc'];
    const result = csvToJSON(input, ';');
    expect(result).toEqual([
      { id: 42, value: 3.14 },
      { id: 100, value: 'abc' },
    ]);
  });
});

import { formatCSVFileToJSONFile } from './csv';
import { readFile, writeFile } from 'node:fs/promises';

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
}));

describe('formatCSVFileToJSONFile', () => {
  beforeEach(() => {
    vi.resetAllMocks(); 
  });

  it('читает файл, преобразует CSV и записывает JSON', async () => {
    const fakeCSV = 'name;age\nRoma;30\nTaya;25';
    (readFile as any).mockResolvedValue(fakeCSV);

    await formatCSVFileToJSONFile('input.csv', 'output.json', ';');

    expect(readFile).toHaveBeenCalledWith('input.csv', 'utf-8');

    const expectedJSON = JSON.stringify([
      { name: 'Roma', age: 30 },
      { name: 'Taya', age: 25 },
    ], null, 2);
    expect(writeFile).toHaveBeenCalledWith('output.json', expectedJSON, 'utf-8');
  });

  it('пробрасывает ошибку, если readFile выбрасывает исключение', async () => {
    (readFile as any).mockRejectedValue(new Error('Файл не найден'));
    await expect(formatCSVFileToJSONFile('missing.csv', 'out.json', ';'))
      .rejects.toThrow('Файл не найден');
    expect(writeFile).not.toHaveBeenCalled();
  });

  it('пробрасывает ошибку, если csvToJSON выбрасывает ошибку', async () => {
    (readFile as any).mockResolvedValue('a;b\n1;2;3');
    await expect(formatCSVFileToJSONFile('bad.csv', 'out.json', ';'))
      .rejects.toThrow(/Несовпадение количества полей/);
    expect(writeFile).not.toHaveBeenCalled();
  });
});