// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import SiteHeader from "./SiteHeader";

afterEach(() => cleanup());

describe("Patient Portal navigation calls to action", () => {
  it("uses the requested dark-green and white treatment in desktop and mobile navigation", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const desktopPortal = screen.getByRole("link", { name: "Patient Portal" });
    expect(desktopPortal.className).toContain("bg-live-oak");
    expect(desktopPortal.className).toContain("text-white");

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const portalLinks = screen.getAllByRole("link", { name: "Patient Portal" });
    const mobilePortal = portalLinks.find(link => link.className.includes("text-center"));

    expect(mobilePortal).toBeTruthy();
    expect(mobilePortal?.className).toContain("bg-live-oak");
    expect(mobilePortal?.className).toContain("text-white");
  });
});
