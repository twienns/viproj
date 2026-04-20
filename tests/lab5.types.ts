// Этот файл проверяется только компилятором TypeScript (tsc --noEmit)
// Он не должен обрабатываться Vitest.

import { query } from '../src/query.js';

type User = {
  id: number;
  name: string;
  surname: string;
  age: number;
  city: string;
};

// Правильная цепочка (не должна вызывать ошибок типов)
const correct = query<User>()
  .where('name', 'Иван')
  .groupBy('city')
  .having(g => g.items.length > 0)
  .sort('key')
  .run([]);

// Ошибочные цепочки – ожидаем ошибки компиляции

// @ts-expect-error: where недоступен после groupBy
query<User>().groupBy('city').where('name', 'Иван');

// @ts-expect-error: having недоступен до groupBy
query<User>().having(() => true);

// @ts-expect-error: sort недоступен до groupBy (на WhereBuilder)
query<User>().sort('age');

// @ts-expect-error: groupBy недоступен после groupBy
query<User>().groupBy('city').groupBy('age');

// @ts-expect-error: where недоступен на HavingBuilder
query<User>().groupBy('city').having(() => true).where('name', 'Иван');

// @ts-expect-error: groupBy недоступен на SortBuilder
query<User>().groupBy('city').having(() => true).sort('key').groupBy('age');