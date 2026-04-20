import { describe, it, expect, vi, beforeEach } from 'vitest';
import { csvToJSON, formatCSVFileToJSONFile } from '../src/lab3';
import * as fsPromises from 'node:fs/promises';

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
}));

describe('csvToJSON', () => {
  it('должен корректно преобразовывать простой CSV', () => {
    const input = ["name;age", "Иван;30", "Пётр;25"];
    const result = csvToJSON(input, ';');
    expect(result).toEqual([
      { name: 'Иван', age: 30 },
      { name: 'Пётр', age: 25 },
    ]);
  });

  it('должен преобразовывать числовые значения в числа', () => {
    const input = ["id;value", "1;123", "2;45.6"];
    const result = csvToJSON(input, ';');
    expect(result).toEqual([
      { id: 1, value: 123 },
      { id: 2, value: 45.6 },
    ]);
  });

  it('должен оставлять строки, если не число', () => {
    const input = ["city;code", "Москва;ABC", "Казань;DEF"];
    const result = csvToJSON(input, ';');
    expect(result).toEqual([
      { city: 'Москва', code: 'ABC' },
      { city: 'Казань', code: 'DEF' },
    ]);
  });

  it('должен выбрасывать ошибку при несовпадении количества столбцов', () => {
    const input = ["a;b;c", "1;2"];
    expect(() => csvToJSON(input, ';')).toThrowError(/Несовпадение количества столбцов/);
  });

  it('должен обрабатывать пробелы вокруг значений', () => {
    const input = [" name ; age ", " Иван ; 30 "];
    const result = csvToJSON(input, ';');
    expect(result).toEqual([{ name: 'Иван', age: 30 }]);
  });

  it('должен возвращать пустой массив для пустого ввода', () => {
    expect(csvToJSON([], ',')).toEqual([]);
  });
});

describe('formatCSVFileToJSONFile', () => {
  const mockReadFile = fsPromises.readFile as vi.Mock;
  const mockWriteFile = fsPromises.writeFile as vi.Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен читать CSV, преобразовывать и записывать JSON', async () => {
    const csvContent = "name;age;city\nИван;30;Москва\nПётр;25;Казань";
    mockReadFile.mockResolvedValueOnce(csvContent);

    await formatCSVFileToJSONFile('data.csv', 'data.json', ';');

    expect(mockReadFile).toHaveBeenCalledTimes(1);
    expect(mockReadFile).toHaveBeenCalledWith('data.csv', 'utf-8');

    const expectedJSON = JSON.stringify([
      { name: 'Иван', age: 30, city: 'Москва' },
      { name: 'Пётр', age: 25, city: 'Казань' },
    ], null, 2);

    expect(mockWriteFile).toHaveBeenCalledTimes(1);
    expect(mockWriteFile).toHaveBeenCalledWith('data.json', expectedJSON, 'utf-8');
  });

  it('должен корректно обрабатывать CSV с другим разделителем', async () => {
    const csvContent = "name,age,city\nИван,30,Москва\nПётр,25,Казань";
    mockReadFile.mockResolvedValueOnce(csvContent);

    await formatCSVFileToJSONFile('data.csv', 'data.json', ',');

    const expectedJSON = JSON.stringify([
      { name: 'Иван', age: 30, city: 'Москва' },
      { name: 'Пётр', age: 25, city: 'Казань' },
    ], null, 2);

    expect(mockWriteFile).toHaveBeenCalledWith('data.json', expectedJSON, 'utf-8');
  });

  it('должен выбрасывать ошибку, если readFile завершится с ошибкой', async () => {
    const error = new Error('Файл не найден');
    mockReadFile.mockRejectedValueOnce(error);

    await expect(
      formatCSVFileToJSONFile('notfound.csv', 'out.json', ';')
    ).rejects.toThrow('Файл не найден');

    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it('должен выбрасывать ошибку, если csvToJSON выбросит ошибку', async () => {
    const csvContent = "name;age\nИван;30;лишнее";
    mockReadFile.mockResolvedValueOnce(csvContent);

    await expect(
      formatCSVFileToJSONFile('bad.csv', 'out.json', ';')
    ).rejects.toThrowError(/Несовпадение количества столбцов/);

    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it('должен игнорировать пустые строки в CSV', async () => {
    const csvContent = "name;age\n\nИван;30\n\nПётр;25\n";
    mockReadFile.mockResolvedValueOnce(csvContent);

    await formatCSVFileToJSONFile('data.csv', 'out.json', ';');

    const expectedJSON = JSON.stringify([
      { name: 'Иван', age: 30 },
      { name: 'Пётр', age: 25 },
    ], null, 2);

    expect(mockWriteFile).toHaveBeenCalledWith('out.json', expectedJSON, 'utf-8');
  });
});