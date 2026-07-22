import { describe, expect, it } from "vitest";
import {
  EligibilityNotConfiguredError,
  REAL_TIME_ELIGIBILITY_ENABLED,
  eligibilityAdapter,
} from "./eligibility";

describe("eligibility integration boundary", () => {
  it("remains disabled until an approved vendor and agreements are configured", async () => {
    expect(REAL_TIME_ELIGIBILITY_ENABLED).toBe(false);
    await expect(
      eligibilityAdapter.checkEligibility({
        payerId: "not-configured",
        providerNpi: "0000000000",
        memberId: "not-submitted",
        patientFirstName: "Not",
        patientLastName: "Submitted",
        patientDateOfBirth: "1900-01-01",
        serviceDate: "1900-01-01",
        serviceTypeCode: "98",
      }),
    ).rejects.toBeInstanceOf(EligibilityNotConfiguredError);
  });
});
