import { getPageNumbers } from "./pageNumbers";

test("shows every page with no ellipsis when there are 7 or fewer", () => {
  expect(getPageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);
  expect(getPageNumbers(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
});

test("near the start: 1 2 3 4 5 … last", () => {
  expect(getPageNumbers(1, 24)).toEqual([1, 2, 3, 4, 5, "…", 24]);
  expect(getPageNumbers(4, 24)).toEqual([1, 2, 3, 4, 5, "…", 24]);
});

test("in the middle: 1 … c-1 c c+1 … last", () => {
  expect(getPageNumbers(5, 24)).toEqual([1, "…", 4, 5, 6, "…", 24]);
  expect(getPageNumbers(12, 24)).toEqual([1, "…", 11, 12, 13, "…", 24]);
});

test("near the end: 1 … last-4 … last", () => {
  expect(getPageNumbers(21, 24)).toEqual([1, "…", 20, 21, 22, 23, 24]);
  expect(getPageNumbers(24, 24)).toEqual([1, "…", 20, 21, 22, 23, 24]);
});

// Debug challenge: the last page must never appear twice
test("never repeats a page number, for any current page", () => {
  for (const total of [8, 9, 10, 24, 100]) {
    for (let current = 1; current <= total; current++) {
      const numbers = getPageNumbers(current, total).filter((p) => p !== "…");
      expect(new Set(numbers).size).toBe(numbers.length);
      expect(numbers[0]).toBe(1);
      expect(numbers[numbers.length - 1]).toBe(total);
    }
  }
});