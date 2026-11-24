import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import { DayOfWeek } from "@/lib/types";

describe("HouseFlow Tasks 4-7: dishes, garbage night, chores, and weekly rotation", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("logs dirty dishes and clears them in 1 tap (US-1)", () => {
    render(<HomePage />);

    fireEvent.click(
      screen.getByRole("button", { name: "+ Log Dirty Dishes or Chore" })
    );
    fireEvent.change(
      screen.getByLabelText("What did you leave in the sink?"),
      { target: { value: "Soup pot & ladle" } }
    );
    fireEvent.click(screen.getByRole("button", { name: "Save Dirty Dishes" }));

    expect(screen.getByText("Soup pot & ladle")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Clear Soup pot & ladle" })
    );
    expect(screen.queryByText("Soup pot & ladle")).not.toBeInTheDocument();
  });

  it("shows garbage night-before reminder when tomorrow is pickup day and marks done (US-3)", () => {
    render(<HomePage />);

    // Set garbage pickup day to tomorrow
    const tomorrow = ((new Date().getDay() + 1) % 7) as DayOfWeek;
    fireEvent.click(screen.getByRole("button", { name: "Chores" }));
    fireEvent.change(screen.getByLabelText("Garbage Pickup Day"), {
      target: { value: String(tomorrow) },
    });

    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    expect(screen.getByText(/Trash Tonight:/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.getByText(/Trash Taken Out:/)).toBeInTheDocument();
  });

  it("adds a chore, cycles its status, and persists across reload (US-2)", () => {
    const { unmount } = render(<HomePage />);

    fireEvent.click(
      screen.getByRole("button", { name: "+ Log Dirty Dishes or Chore" })
    );
    fireEvent.click(screen.getByRole("button", { name: "New Chore" }));
    fireEvent.change(screen.getByLabelText("Chore title"), {
      target: { value: "Wipe microwave" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Chore" }));

    expect(screen.getByText("Wipe microwave")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Chores" }));
    const wipeRow = screen.getByText("Wipe microwave").closest("li")!;
    const statusBtn = wipeRow.querySelector("button")!;
    expect(statusBtn).toHaveTextContent("Open");

    fireEvent.click(statusBtn);
    expect(statusBtn).toHaveTextContent("In Progress");

    // Simulate reload
    unmount();
    render(<HomePage />);
    fireEvent.click(screen.getByRole("button", { name: "Chores" }));
    const persistedRow = screen.getByText("Wipe microwave").closest("li")!;
    expect(persistedRow.querySelector("button")).toHaveTextContent(
      "In Progress"
    );
  });

  it("advances weekly rotation to the next housemate (US-4)", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByRole("button", { name: "Chores" }));
    expect(screen.getByText(/Week 1/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Advance Week" }));
    expect(screen.getByText(/Week 2/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    // Living Room & Hall Vacuum was at rotationIndex 3 (Housemate D); advancing 1 week rotates it to Alex (You)
    expect(screen.getByText("Living Room & Hall Vacuum")).toBeInTheDocument();
  });
});
