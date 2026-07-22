// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import Portal from "./Portal";

const mocks = vi.hoisted(() => ({
  authenticated: true,
  startLogin: vi.fn(),
  logout: vi.fn(),
  invalidate: vi.fn(),
  markViewed: vi.fn(),
  launch: vi.fn(() => new Promise(() => {})),
}));

vi.mock("@/const", () => ({
  startLogin: mocks.startLogin,
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({
    user: mocks.authenticated
      ? { id: 9, name: "Alonzo Patient", role: "user" }
      : null,
    loading: false,
    logout: mocks.logout,
  }),
}));

beforeEach(() => {
  mocks.authenticated = true;
});

vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({ notices: { inbox: { invalidate: mocks.invalidate } } }),
    notices: {
      inbox: {
        useQuery: () => ({
          data: { notices: [], unreadCount: 0 },
          isLoading: false,
          error: null,
        }),
      },
      markViewed: {
        useMutation: () => ({ mutate: mocks.markViewed, isPending: false }),
      },
    },
    telehealth: {
      launch: {
        useMutation: () => ({
          mutateAsync: mocks.launch,
          isPending: false,
          error: null,
        }),
      },
    },
  },
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("authenticated Doxy.me launch modal", () => {
  it("moves focus into the dialog, closes safely, and invokes the approved launch action", async () => {
    const user = userEvent.setup();
    render(<Portal />);

    const trigger = screen.getByRole("button", { name: "Start telemedicine session" });
    await user.click(trigger);

    const dialog = screen.getByRole("dialog");
    expect(screen.getByRole("heading", { name: "Continue to Dr. McAlpine’s Doxy.me waiting room?" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Not now" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Continue to Doxy.me" })).toBeTruthy();
    expect(dialog.contains(document.activeElement)).toBe(true);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Not now" }));
    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Continue to Doxy.me" }));
    expect(mocks.launch).toHaveBeenCalledTimes(1);
  });
});

describe("portal authentication boundary", () => {
  it("preserves the portal destination without exposing notices or telemedicine controls", async () => {
    mocks.authenticated = false;
    const user = userEvent.setup();
    render(<Portal />);

    const signIn = screen.getByRole("button", { name: "Sign in to the portal" });
    expect(signIn).toBeTruthy();
    expect(screen.getByText(/This portal does not collect medical records/)).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Notice inbox" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Start telemedicine session" })).toBeNull();

    await user.click(signIn);
    expect(mocks.startLogin).toHaveBeenCalledWith("/portal");
  });
});
