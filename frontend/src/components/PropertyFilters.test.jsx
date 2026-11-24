import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PropertyFilters from "./PropertyFilters";

test("renders all six inputs", () => {
  render(<PropertyFilters onSearch={() => {}} onClear={() => {}} />);
  ["City", "ZIP code", "Min price", "Max price", "Beds", "Baths"].forEach((label) => {
    expect(screen.getByLabelText(label)).toBeInTheDocument();
  });
});

test("submits only the filled-in values", async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();
  render(<PropertyFilters onSearch={onSearch} onClear={() => {}} />);

  await user.type(screen.getByLabelText("City"), "Irvine");
  await user.selectOptions(screen.getByLabelText("Beds"), "3");
  await user.click(screen.getByRole("button", { name: "Search" }));

  expect(onSearch).toHaveBeenCalledWith({ city: "Irvine", beds: "3" });
});

test("Clear Filters resets the form and calls onClear", async () => {
  const user = userEvent.setup();
  const onClear = vi.fn();
  render(<PropertyFilters onSearch={() => {}} onClear={onClear} />);

  await user.type(screen.getByLabelText("City"), "Irvine");
  await user.click(screen.getByRole("button", { name: "Clear Filters" }));

  expect(screen.getByLabelText("City")).toHaveValue("");
  expect(onClear).toHaveBeenCalledTimes(1);
});