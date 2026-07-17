/**
 * The Open Porch coverage planner: plain-language reassurance, no dark patterns,
 * and no promise of benefits that only the insurer and practice can confirm.
 */
import { CircleAlert, Phone, ReceiptText, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";

type Plan = {
  value: string;
  label: string;
  status: "listed" | "confirm";
};

const plans: Plan[] = [
  { value: "aetna", label: "Aetna", status: "listed" },
  { value: "anthem", label: "Anthem / Blue Cross Blue Shield of Georgia", status: "listed" },
  { value: "cigna", label: "Cigna", status: "listed" },
  { value: "united", label: "UnitedHealthcare", status: "listed" },
  { value: "kaiser", label: "Kaiser Permanente", status: "confirm" },
  { value: "medicaid", label: "Georgia Medicaid / PeachCare for Kids", status: "confirm" },
  { value: "peach", label: "Peach State Health Plan", status: "confirm" },
  { value: "wellpoint", label: "Wellpoint Georgia", status: "confirm" },
  { value: "caresource", label: "CareSource", status: "confirm" },
  { value: "other", label: "Another plan", status: "confirm" },
];

type Result = {
  plan: Plan;
  copay: number | null;
};

export default function InsurancePlanner() {
  const [planValue, setPlanValue] = useState("");
  const [copay, setCopay] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const plan = plans.find((item) => item.value === planValue);
    if (!plan) return;

    const parsedCopay = copay.trim() === "" ? null : Number.parseFloat(copay);
    setResult({
      plan,
      copay: parsedCopay !== null && Number.isFinite(parsedCopay) ? Math.max(0, parsedCopay) : null,
    });
  }

  return (
    <div className="paper-ledger relative border-y border-live-oak/20 bg-white/72 px-5 py-7 shadow-[0_22px_60px_rgba(43,50,42,0.08)] sm:border sm:px-9 sm:py-9 sm:pl-12">
      <span className="absolute inset-y-0 left-0 hidden w-1.5 bg-coral sm:block" aria-hidden="true" />
      <div className="mb-6 flex items-start gap-4">
        <img src="/manus-storage/mcalpine-heart-sprout-mark_73e5720e.png" alt="" className="h-10 w-10 shrink-0 object-contain" />
        <div>
          <p className="eyebrow">Coverage note · No. 01</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-live-oak sm:text-3xl">Plan before you arrive.</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="insurance-plan" className="mb-2 block text-sm font-bold text-live-oak">
            Choose your insurance plan
          </label>
          <select
            id="insurance-plan"
            value={planValue}
            onChange={(event) => {
              setPlanValue(event.target.value);
              setResult(null);
            }}
            required
            className="min-h-12 w-full rounded-xl border border-live-oak/20 bg-porch px-4 text-base text-foreground shadow-inner outline-none transition focus:border-coral-deep focus:ring-4 focus:ring-coral/25"
          >
            <option value="" disabled>
              Select a plan
            </option>
            {plans.map((plan) => (
              <option key={plan.value} value={plan.value}>
                {plan.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="copay" className="mb-2 block text-sm font-bold text-live-oak">
            Co-pay shown on your card <span className="font-medium text-foreground/55">(optional)</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-bold text-live-oak/65" aria-hidden="true">
              $
            </span>
            <input
              id="copay"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={copay}
              onChange={(event) => {
                setCopay(event.target.value);
                setResult(null);
              }}
              placeholder="25.00"
              className="min-h-12 w-full rounded-xl border border-live-oak/20 bg-porch py-3 pl-8 pr-4 text-base text-foreground shadow-inner outline-none transition placeholder:text-foreground/35 focus:border-coral-deep focus:ring-4 focus:ring-coral/25"
            />
          </div>
        </div>

        <button
          type="submit"
          className="button-press flex min-h-12 w-full items-center justify-center rounded-xl bg-live-oak px-5 py-3 font-bold text-white shadow-[0_10px_24px_rgba(23,63,58,0.18)] transition hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35"
        >
          Check plan & estimate
        </button>
      </form>

      <div className="mt-6 min-h-[92px]" aria-live="polite">
        {result ? (
          <div className={`rounded-2xl border p-4 ${result.plan.status === "listed" ? "border-live-oak/15 bg-sage/70" : "border-coral/30 bg-coral-soft"}`}>
            <div className="flex items-start gap-3">
              {result.plan.status === "listed" ? (
                <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-live-oak" />
              ) : (
                <CircleAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-coral-deep" />
              )}
              <div>
                <p className="font-bold text-live-oak">
                  {result.plan.status === "listed" ? "Listed in public provider directories" : "Please confirm with the office"}
                </p>
                <p className="mt-1 text-sm leading-6 text-foreground/75">
                  {result.plan.status === "listed"
                    ? `Dr. McAlpine appears in public listings for ${result.plan.label}. Network participation still varies by exact plan, employer, and year.`
                    : `We do not have a verified current listing for ${result.plan.label}. This does not mean the plan is declined—the office can check your exact product.`}
                </p>
                {result.copay !== null ? (
                  <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-live-oak">
                    <ReceiptText aria-hidden="true" className="h-4 w-4" />
                    Entered co-pay: ${result.copay.toFixed(2)}
                  </p>
                ) : null}
                <a href="tel:+19123493682" className="mt-3 inline-flex items-center gap-2 rounded-sm text-sm font-bold text-coral-deep underline decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35">
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  Confirm at (912) 349-3682
                </a>
              </div>
            </div>
          </div>
        ) : (
          <p className="flex items-start gap-2 text-sm leading-6 text-foreground/60">
            <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            Insurance participation and patient responsibility can change. This tool is a planning aid, not a coverage guarantee.
          </p>
        )}
      </div>
    </div>
  );
}
