import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HouseFlow shell and navigation", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("renders the household header, daily rules on Today, and switches between all 4 tabs", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "Maple St. House" })).toBeInTheDocument();
    expect(screen.getByText("Dirty Dishes in Sink")).toBeInTheDocument();
    expect(screen.getByText("House Rules & Night Check")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Supplies" }));
    expect(screen.getByText("Shared House Supplies")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Chores" }));
    expect(screen.getByText("Weekly House & Exterior")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Repairs" }));
    expect(screen.getByText("Repairs & Landlord Log")).toBeInTheDocument();
  });

  it("toggles Light and Dark Mode and updates document class", () => {
    render(<HomePage />);

    const modeBtn = screen.getByRole("button", { name: /Mode:/ });
    expect(modeBtn).toHaveTextContent("Mode: Dark");

    fireEvent.click(modeBtn);
    expect(modeBtn).toHaveTextContent("Mode: Light");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
