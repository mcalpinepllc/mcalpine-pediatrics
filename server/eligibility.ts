/**
 * Contract boundary for a future approved X12 270/271 clearinghouse or payer API.
 *
 * No route currently accepts these fields, no credentials are configured, and no
 * member eligibility data is persisted. A production adapter must not be enabled
 * until the practice has approved the vendor, required agreements, security
 * review, credential storage, audit controls, and data-retention rules.
 */
export type EligibilityRequest = {
  payerId: string;
  providerNpi: string;
  memberId: string;
  patientFirstName: string;
  patientLastName: string;
  patientDateOfBirth: string;
  serviceDate: string;
  serviceTypeCode: string;
};

export type EligibilityResult = {
  status: "active" | "inactive" | "unknown";
  traceId: string;
  responseReceivedAt: number;
  planName?: string;
  summary?: string;
};

export interface EligibilityAdapter {
  checkEligibility(request: EligibilityRequest): Promise<EligibilityResult>;
}

export class EligibilityNotConfiguredError extends Error {
  constructor() {
    super("Real-time eligibility is not configured.");
    this.name = "EligibilityNotConfiguredError";
  }
}

export class DisabledEligibilityAdapter implements EligibilityAdapter {
  async checkEligibility(_request: EligibilityRequest): Promise<EligibilityResult> {
    throw new EligibilityNotConfiguredError();
  }
}

export const eligibilityAdapter: EligibilityAdapter = new DisabledEligibilityAdapter();
export const REAL_TIME_ELIGIBILITY_ENABLED = false as const;
