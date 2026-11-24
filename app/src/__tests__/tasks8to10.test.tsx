import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HouseFlow Tasks 8-10: supplies, repairs, daily house rules, and preview controls", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("flags a supply low, marks an out supply restocked, and adds a new supply (US-5)", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByRole("button", { name: "Supplies" }));

    // Restock Trash Bags (initially Out)
    const trashRow = screen.getByText("Trash Bags").closest("li")!;
    fireEvent.click(trashRow.querySelector("button:last-child")!);
    expect(
      screen.getByRole("button", { name: "Trash Bags status: Stocked. Tap to cycle" })
    ).toBeInTheDocument();

    // Flag Dish Soap as low
    const soapRow = screen.getByText("Dish Soap").closest("li")!;
    fireEvent.click(soapRow.querySelector("button:last-child")!);
    expect(
      screen.getByRole("button", { name: "Dish Soap status: Low. Tap to cycle" })
    ).toBeInTheDocument();

    // Add a new needed supply
    fireEvent.click(screen.getByRole("button", { name: "+ Flag Low Supply" }));
    fireEvent.change(screen.getByLabelText("Supply item name"), {
      target: { value: "Dishwasher pods" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Supply" }));
    expect(screen.getByText("Dishwasher pods")).toBeInTheDocument();
  });

  it("reports a repair with date/time, updates status (Reported / Fixed), and keeps fixed issues in Issue History (US-6)", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByRole("button", { name: "Repairs" }));
    expect(screen.getByText("Issue History")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "+ Report Repair Issue" }));
    fireEvent.change(screen.getByLabelText("Repair issue title"), {
      target: { value: "Loose closet hinge" },
    });
    fireEvent.change(screen.getByLabelText("Repair location"), {
      target: { value: "Hallway" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Issue" }));

    const statusGroup = screen.getByRole("group", {
      name: "Status for Loose closet hinge",
    });
    expect(
      within(statusGroup).getByRole("button", { name: "Reported" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      within(statusGroup).queryByRole("button", { name: "In Progress" })
    ).not.toBeInTheDocument();

    // Reported timestamp is visible on the new item
    const itemCard = screen.getByText("Loose closet hinge").closest("li")!;
    expect(itemCard).toHaveTextContent(/Reported /);

    // Mark Fixed -> appears in Issue History with Fixed timestamp
    fireEvent.click(within(statusGroup).getByRole("button", { name: "Fixed" }));
    const historyHeading = screen.getByText("Issue History").closest("div")!.parentElement!;
    expect(within(historyHeading).getByText("Loose closet hinge")).toBeInTheDocument();
    expect(within(historyHeading).getByText("2 fixed")).toBeInTheDocument();
  });

  it("toggles and adds daily house rules on Today and triggers reminder previews from Repairs (US-7)", () => {
    render(<HomePage />);

    // House rules live directly on Today
    const dishRuleBtn = screen.getByRole("button", {
      name: "Dishes cleared within 2 hours: Pending",
    });
    fireEvent.click(dishRuleBtn);
    expect(
      screen.getByRole("button", {
        name: "Dishes cleared within 2 hours: Checked",
      })
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("New house rule"), {
      target: { value: "Quiet hours after 11 PM" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByText("Quiet hours after 11 PM")).toBeInTheDocument();

    // Reminder preview controls live on the Repairs tab
    fireEvent.click(screen.getByRole("button", { name: "Repairs" }));
    fireEvent.click(
      screen.getByRole("button", { name: /Fast-forward dish timer/ })
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Preview Trash Night reminder/ })
    );
    fireEvent.click(screen.getByRole("button", { name: "Today" }));

    expect(screen.getByText(/Daytime Dish Reminder:/)).toBeInTheDocument();
    expect(screen.getByText(/Trash Tonight:/)).toBeInTheDocument();
  });
});
