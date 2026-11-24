import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

const pageLabels = () =>
  screen
    .getAllByRole("button")
    .map((b) => b.textContent)
    .filter((t) => /^\d+$/.test(t));

test("renders nothing when there is only one page", () => {
  const { container } = render(
    <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
  );
  expect(container).toBeEmptyDOMElement();
});

test("first page: Previous is disabled, Next is enabled", () => {
  render(<Pagination currentPage={1} totalPages={24} onPageChange={() => {}} />);
  expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
  expect(pageLabels()).toEqual(["1", "2", "3", "4", "5", "24"]);
  expect(screen.getAllByText("…")).toHaveLength(1);
});

test("last page: Next is disabled, Previous is enabled, last page shown once", () => {
  render(<Pagination currentPage={24} totalPages={24} onPageChange={() => {}} />);
  expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Previous" })).toBeEnabled();
  expect(pageLabels()).toEqual(["1", "20", "21", "22", "23", "24"]);
  expect(screen.getAllByText("…")).toHaveLength(1);
});

test("middle page: ellipsis on both sides", () => {
  render(<Pagination currentPage={5} totalPages={24} onPageChange={() => {}} />);
  expect(pageLabels()).toEqual(["1", "4", "5", "6", "24"]);
  expect(screen.getAllByText("…")).toHaveLength(2);
});

test("no ellipsis when all pages fit", () => {
  render(<Pagination currentPage={2} totalPages={5} onPageChange={() => {}} />);
  expect(pageLabels()).toEqual(["1", "2", "3", "4", "5"]);
  expect(screen.queryByText("…")).not.toBeInTheDocument();
});

test("marks the current page", () => {
  render(<Pagination currentPage={5} totalPages={24} onPageChange={() => {}} />);
  expect(screen.getByRole("button", { name: "5" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("button", { name: "4" })).not.toHaveAttribute("aria-current");
});

test("clicking a page number calls onPageChange with that page", () => {
  const onPageChange = vi.fn();
  render(<Pagination currentPage={5} totalPages={24} onPageChange={onPageChange} />);
  fireEvent.click(screen.getByRole("button", { name: "6" }));
  expect(onPageChange).toHaveBeenCalledWith(6);
});

test("Previous and Next move one page", () => {
  const onPageChange = vi.fn();
  render(<Pagination currentPage={5} totalPages={24} onPageChange={onPageChange} />);
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(onPageChange).toHaveBeenLastCalledWith(6);
  fireEvent.click(screen.getByRole("button", { name: "Previous" }));
  expect(onPageChange).toHaveBeenLastCalledWith(4);
});