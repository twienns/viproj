import { describe, it, expectTypeOf } from 'vitest';
import { DeepReadonly, PickedByType, EventHandlers } from '../src/types.js';

describe('Лабораторная работа №6: утилитарные типы', () => {
  describe('DeepReadonly', () => {
    it('делает примитивы readonly', () => {
      type Input = { a: number; b: string };
      type Output = DeepReadonly<Input>;
      expectTypeOf<Output>().toMatchTypeOf<{ readonly a: number; readonly b: string }>();
    });

    it('работает рекурсивно с вложенными объектами', () => {
      type Input = { user: { name: string; age: number } };
      type Output = DeepReadonly<Input>;
      expectTypeOf<Output>().toMatchTypeOf<{
        readonly user: { readonly name: string; readonly age: number };
      }>();
    });

    it('не затрагивает функции', () => {
      type Input = { fn: () => void };
      type Output = DeepReadonly<Input>;
      expectTypeOf<Output>().toMatchTypeOf<{ fn: () => void }>();
    });

    it('работает с массивами (делает readonly tuple)', () => {
      type Input = { items: string[] };
      type Output = DeepReadonly<Input>;
      expectTypeOf<Output>().toMatchTypeOf<{ readonly items: readonly string[] }>();
    });
  });

  describe('PickedByType', () => {
    it('выбирает свойства указанного типа', () => {
      type Input = { a: number; b: string; c: number };
      type Output = PickedByType<Input, number>;
      expectTypeOf<Output>().toMatchTypeOf<{ a: number; c: number }>();
    });

    it('возвращает пустой объект, если нет совпадений', () => {
      type Input = { a: number; b: string };
      type Output = PickedByType<Input, boolean>;
      expectTypeOf<Output>().toMatchTypeOf<{}>();
    });

    it('корректно работает с union типами', () => {
      type Input = { a: number | string; b: string; c: number };
      type Output = PickedByType<Input, string>;
      expectTypeOf<Output>().toMatchTypeOf<{ a: number | string; b: string }>();
    });
  });

  describe('EventHandlers', () => {
    it('генерирует обработчики с префиксом on', () => {
      type Events = { click: { x: number }; change: string };
      type Handlers = EventHandlers<Events>;
      expectTypeOf<Handlers>().toMatchTypeOf<{
        onClick: (payload: { x: number }) => void;
        onChange: (payload: string) => void;
      }>();
    });

    it('работает с пустым объектом', () => {
      type Events = {};
      type Handlers = EventHandlers<Events>;
      expectTypeOf<Handlers>().toMatchTypeOf<{}>();
    });

    it('капитализирует первую букву события', () => {
      type Events = { mousedown: number; keyup: string };
      type Handlers = EventHandlers<Events>;
      expectTypeOf<Handlers>().toMatchTypeOf<{
        onMousedown: (payload: number) => void;
        onKeyup: (payload: string) => void;
      }>();
    });
  });
});