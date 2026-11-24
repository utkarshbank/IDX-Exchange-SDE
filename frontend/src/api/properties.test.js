import { fetchProperties } from "./properties";

afterEach(() => vi.unstubAllGlobals());

test("builds the query string and returns the JSON", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ total: 1, results: [] }),
  }));
  const data = await fetchProperties({ city: "Irvine", beds: "3" });
  expect(fetch).toHaveBeenCalledWith("/api/properties?city=Irvine&beds=3");
  expect(data.total).toBe(1);
});

test("does not send empty filter values", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ total: 0, results: [] }),
  }));
  await fetchProperties({ city: "Irvine", zipcode: "", beds: "" });
  expect(fetch).toHaveBeenCalledWith("/api/properties?city=Irvine");
});

test("throws the backend's error message on an HTTP error", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: false,
    status: 400,
    json: async () => ({ error: "minPrice must be a number" }),
  }));
  await expect(fetchProperties({ minPrice: "abc" })).rejects.toThrow("minPrice must be a number");
});

test("throws a friendly message when the server is unreachable", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
  await expect(fetchProperties()).rejects.toThrow("Could not reach the server");
});