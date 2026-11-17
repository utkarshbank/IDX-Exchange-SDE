import { renderHook, act } from "@testing-library/react";
import { useFavorites } from "./useFavorites";

beforeEach(() => localStorage.clear());

test("starts empty", () => {
  const { result } = renderHook(() => useFavorites());
  expect(result.current.favorites).toEqual([]);
  expect(result.current.count).toBe(0);
});

test("toggle adds then removes a favorite", () => {
  const { result } = renderHook(() => useFavorites());
  act(() => result.current.toggle("111"));
  expect(result.current.isFavorite("111")).toBe(true);
  expect(result.current.count).toBe(1);
  act(() => result.current.toggle("111"));
  expect(result.current.isFavorite("111")).toBe(false);
  expect(result.current.count).toBe(0);
});

test("persists to localStorage and survives a remount", () => {
  const first = renderHook(() => useFavorites());
  act(() => first.result.current.toggle("222"));
  first.unmount();

  const second = renderHook(() => useFavorites());
  expect(second.result.current.isFavorite("222")).toBe(true);
  expect(JSON.parse(localStorage.getItem("idx-favorites"))).toEqual(["222"]);
});

test("treats numeric and string ids the same", () => {
  const { result } = renderHook(() => useFavorites());
  act(() => result.current.toggle(333));
  expect(result.current.isFavorite("333")).toBe(true);
});

test("ignores corrupted localStorage data", () => {
  localStorage.setItem("idx-favorites", "not json{{");
  const { result } = renderHook(() => useFavorites());
  expect(result.current.favorites).toEqual([]);
});