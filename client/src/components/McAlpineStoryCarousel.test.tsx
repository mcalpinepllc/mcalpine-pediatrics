// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import McAlpineStoryCarousel from "./McAlpineStoryCarousel";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(() => cleanup());

describe.each([390, 1280])("carousel focus contracts at %ipx", viewportWidth => {
  it("keeps the region and all navigation controls keyboard-focusable with visible-ring classes", () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: viewportWidth,
    });

    render(<McAlpineStoryCarousel />);

    const region = screen.getByRole("region", { name: "Dr. McAlpine photo stories" });
    const previous = screen.getByRole("button", { name: "Previous slide" });
    const next = screen.getByRole("button", { name: "Next slide" });
    const firstDot = screen.getByRole("button", { name: /Show photo 1:/ });

    expect(region.tabIndex).toBe(0);
    expect(region.className).toContain("focus-visible:ring-4");

    for (const control of [previous, next, firstDot]) {
      expect(control.className).toContain("focus-visible:ring");
    }

    firstDot.focus();
    expect(document.activeElement).toBe(firstDot);
    region.focus();
    expect(document.activeElement).toBe(region);
  });
});
