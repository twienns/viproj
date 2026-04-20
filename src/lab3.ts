import { readFile, writeFile } from 'node:fs/promises';

export function csvToJSON(input: string[], delimiter: string): object[] {
  if (input.length === 0) {
    return [];
  }

  const headers = input[0].split(delimiter).map(h => h.trim());
  const headerCount = headers.length;
  const result: object[] = [];

  for (let i = 1; i < input.length; i++) {
    const line = input[i];
    const values = line.split(delimiter);

    if (values.length !== headerCount) {
      throw new Error(
        `Несовпадение количества столбцов в строке ${i + 1}. ` +
        `Ожидалось ${headerCount}, получено ${values.length}.`
      );
    }

    const obj: Record<string, any> = {};
    for (let j = 0; j < headerCount; j++) {
      const key = headers[j];
      const rawValue = values[j].trim();
      const numValue = Number(rawValue);
      obj[key] = isNaN(numValue) ? rawValue : numValue;
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
  const content = await readFile(input, 'utf-8');
  const lines = content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
  const jsonData = csvToJSON(lines, delimiter);
  await writeFile(output, JSON.stringify(jsonData, null, 2), 'utf-8');
}