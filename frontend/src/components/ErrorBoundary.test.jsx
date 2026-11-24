import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

let shouldThrow = true;
function Bomb() {
  if (shouldThrow) throw new Error("boom");
  return <p>All good</p>;
}

beforeEach(() => {
  shouldThrow = true;
  vi.spyOn(console, "error").mockImplementation(() => {}); // React logs caught errors
});
afterEach(() => vi.restoreAllMocks());

test("renders children when nothing throws", () => {
  shouldThrow = false;
  render(<ErrorBoundary><Bomb /></ErrorBoundary>);
  expect(screen.getByText("All good")).toBeInTheDocument();
});

test("shows the recovery UI when a child throws", () => {
  render(<ErrorBoundary><Bomb /></ErrorBoundary>);
  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
});

test("Try again re-renders the children once the problem is gone", () => {
  render(<ErrorBoundary><Bomb /></ErrorBoundary>);
  shouldThrow = false;
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(screen.getByText("All good")).toBeInTheDocument();
});