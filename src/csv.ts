import { readFile, writeFile } from 'node:fs/promises';

export function csvToJSON(input: string[], delimiter: string): object[] {
  if (input.length === 0) return [];
  const headers = input[0].split(delimiter);
  const result: object[] = [];

  for (let i = 1; i < input.length; i++) {
    const values = input[i].split(delimiter);
    if (values.length !== headers.length) {
      throw new Error(`Несовпадение количества полей в строке ${i + 1}: ожидается ${headers.length}, получено ${values.length}`);
    }
    const obj: Record<string, any> = {};
    for (let j = 0; j < headers.length; j++) {
      let value: any = values[j];
      // Преобразуем число, если возможно
      if (!isNaN(Number(value)) && value !== '') {
        value = Number(value);
      }
      obj[headers[j]] = value;
    }
    result.push(obj);
  }
  return result;
}


export async function formatCSVFileToJSONFile(
  input: string,
  output: string,
  delimiter: string
): Promise<void> {
  const fileContent = await readFile(input, 'utf-8');
  const lines = fileContent.split('\n').filter(line => line.trim() !== '');
  const jsonArray = csvToJSON(lines, delimiter);
  await writeFile(output, JSON.stringify(jsonArray, null, 2), 'utf-8');
}