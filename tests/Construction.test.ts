import { expect, test } from 'bun:test';
import { fromArray, fromValue, NonEmptyList } from '../src/index';

test('Construction from a single value', () => {
  const singleton = fromValue('foo');

  expect(singleton.first).toBe('foo');
  expect(singleton.rest).toEqual([]);
});

test('Construction from an array', () => {
  const singleton = fromArray(['foo']);

  singleton.cata({
    Err: (msg) => expect(false).toBe(true), // Fail if Err
    Ok: (list) => {
      expect(list.first).toBe('foo');
      expect(list.rest).toEqual([]);
    },
  });

  const many = fromArray(['foo', 'bar']);

  many.cata({
    Err: (msg) => expect(false).toBe(true), // Fail if Err
    Ok: (list) => {
      expect(list.first).toBe('foo');
      expect(list.rest).toEqual(['bar']);
    },
  });

  const failed = fromArray([]);

  failed.cata({
    Err: (msg) => expect(true).toBe(true), // Pass if Err
    Ok: (list) => expect(false).toBe(true), // Fail if Ok
  });
});

test('concat', () => {
  const numbers = new NonEmptyList(0, [1, 2, 3]);
  const moreNumbers = new NonEmptyList(4, [5, 6, 7]);
  const concatted = numbers.concat(moreNumbers);

  expect(concatted.first).toBe(0);
  expect(concatted.rest).toEqual([1, 2, 3, 4, 5, 6, 7]);

  expect(numbers.concat([4, 5, 6, 7]).toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
});
