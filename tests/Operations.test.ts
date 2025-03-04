import { expect, test } from 'bun:test';
import { NonEmptyList } from '../src';

const isOdd = (n: number) => n % 2 === 1;

test('map', () => {
  const numbers = new NonEmptyList(0, [1, 2, 3]);
  const doubled = numbers.map((n) => n * 2);

  expect(doubled.first).toBe(0);
  expect(doubled.rest).toEqual([2, 4, 6]);
});

test('reduce (using sum)', () => {
  const numbers = new NonEmptyList(0, [1, 2, 3]);

  const sum = numbers.reduce<number>((v, n) => (v || 0) + n, 0);

  expect(sum).toBe(6);
});

test('filter', () => {
  const numbers = new NonEmptyList(0, [1, 2, 3, 4]);

  const filtered = numbers.filter(isOdd);

  expect(filtered).toEqual([1, 3]);
});

test('sort', () => {
  const numbers = new NonEmptyList(3, [0, 4, 5, 1, 2]);
  const sorted = numbers.sort();

  expect(sorted.first).toBe(0);
  expect(sorted.rest).toEqual([1, 2, 3, 4, 5]);
});

test('some and every', () => {
  const evens = new NonEmptyList(2, [4, 6, 8]);
  const odds = new NonEmptyList(1, [3, 5, 7]);
  const mixed = new NonEmptyList(1, [2, 3, 5, 7]);

  expect(evens.every(isOdd)).toBe(false);
  expect(odds.every(isOdd)).toBe(true);
  expect(mixed.every(isOdd)).toBe(false);

  expect(evens.some(isOdd)).toBe(false);
  expect(odds.some(isOdd)).toBe(true);
  expect(mixed.some(isOdd)).toBe(true);
});

test('take and drop', () => {
  const numbers = new NonEmptyList(0, [1, 2, 3]);

  expect(numbers.take(2)).toEqual([0, 1]);
  expect(numbers.drop(2)).toEqual([2, 3]);
});

test('includes', () => {
  const numbers = new NonEmptyList(0, [1, 2, 3]);

  expect(numbers.includes(0)).toBe(true);
  expect(numbers.includes(2)).toBe(true);
  expect(numbers.includes(5)).toBe(false);
});

test('reverse', () => {
  const numbers = new NonEmptyList(0, [1, 2, 3]);
  const reversed = numbers.reverse();

  expect(reversed.first).toBe(3);
  expect(reversed.rest).toEqual([2, 1, 0]);
});

test('find', () => {
  const numbers = new NonEmptyList(1, [2, 3, 4, 5]);

  numbers.find(isOdd).cata({
    Nothing: () => expect(false).toBe(true), // Fail if Nothing
    Just: (v) => expect(v).toBe(1),
  });

  numbers
    .find((n) => n === 4)
    .cata({
      Nothing: () => expect(false).toBe(true), // Fail if Nothing
      Just: (v) => expect(v).toBe(4),
    });

  numbers
    .find((n) => n === 100)
    .cata({
      Nothing: () => expect(true).toBe(true), // Pass if Nothing
      Just: (v) => expect(true).toBe(false), // Fail if Just
    });
});

test('[Symbol.iterator]', () => {
  const numbers = new NonEmptyList(1, [2, 3, 4]);
  const ary = Array.from(numbers);

  expect(ary).toEqual([1, 2, 3, 4]);
});
