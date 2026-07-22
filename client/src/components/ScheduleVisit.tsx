/**
 * The Open Porch scheduling preview: one decision at a time, no medical details,
 * and an honest handoff to the office until secure scheduling is connected.
 */
import { CalendarDays, Check, Clipboard, Clock3, PhoneCall } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type VisitDate = { date: Date; kind: "office" | "telehealth" };

function getUpcomingVisitDates() {
  const dates: VisitDate[] = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1);

  while (dates.length < 6) {
    const day = cursor.getDay();
    if ([1, 2, 4].includes(day)) dates.push({ date: new Date(cursor), kind: "office" });
    if (day === 5) dates.push({ date: new Date(cursor), kind: "telehealth" });
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

function compactDate(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function fullDate(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export default function ScheduleVisit() {
  const dates = useMemo(() => getUpcomingVisitDates(), []);
  const [selectedDate, setSelectedDate] = useState<VisitDate | null>(null);
  const [selectedWindow, setSelectedWindow] = useState("");
  const [prepared, setPrepared] = useState(false);

  const visitWindows = selectedDate?.kind === "telehealth" ? ["10:00 AM–12:00 PM"] : ["10:00 AM–12:00 PM", "1:00 PM–5:00 PM"];
  const summary = selectedDate && selectedWindow ? `Appointment preference: ${selectedDate.kind === "telehealth" ? "telehealth" : "office"} visit on ${fullDate(selectedDate.date)}, ${selectedWindow}.` : "";

  async function copyPreference() {
    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Visit preference copied");
    } catch {
      toast.info(summary);
    }
  }

  return (
    <div className="appointment-ledger relative border-y border-live-oak/20 bg-porch p-5 text-foreground shadow-[0_24px_70px_rgba(23,63,58,0.12)] sm:border sm:border-l-[7px] sm:border-l-coral sm:p-8 lg:p-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md">
          <p className="eyebrow">Appointment note · No. 02</p>
          <h3 className="mt-3 font-display text-3xl font-semibold leading-tight text-live-oak sm:text-4xl">Choose a visit preference.</h3>
          <p className="mt-4 leading-7 text-foreground/70">
            Choose an office day or Friday telehealth window, then call with your preference. We keep medical details out of this preview to protect your privacy.
          </p>
          <div className="mt-6 border-l-2 border-coral bg-coral-soft/65 px-4 py-3 text-sm leading-6 text-foreground/75">
            <strong className="text-live-oak">Request preview:</strong> this is not live booking. The office must confirm the date, time, visit type, and availability.
          </div>
        </div>

        <div className="min-w-0 flex-1 lg:max-w-2xl">
          <fieldset>
            <legend className="flex items-center gap-2 text-sm font-bold text-live-oak">
              <CalendarDays aria-hidden="true" className="h-5 w-5 text-coral-deep" />
              1. Select an available day
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {dates.map((item) => {
                const selected = selectedDate?.date.toDateString() === item.date.toDateString();
                return (
                  <button
                    key={item.date.toISOString()}
                    type="button"
                    onClick={() => {
                      setSelectedDate(item);
                      setSelectedWindow("");
                      setPrepared(false);
                    }}
                    aria-pressed={selected}
                    className={`button-press min-h-12 rounded-sm border px-3 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35 ${
                      selected ? "border-live-oak bg-live-oak text-white shadow-md" : "border-live-oak/15 bg-white text-live-oak hover:border-coral hover:bg-coral-soft"
                    }`}
                  >
                    <span className="block">{compactDate(item.date)}</span>
                    <span className={`mt-1 block text-[0.62rem] uppercase tracking-[0.12em] ${selected ? "text-white/70" : "text-foreground/48"}`}>{item.kind === "telehealth" ? "Telehealth" : "In office"}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="flex items-center gap-2 text-sm font-bold text-live-oak">
              <Clock3 aria-hidden="true" className="h-5 w-5 text-coral-deep" />
              2. Choose a time of day
            </legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {visitWindows.map((window) => {
                const selected = selectedWindow === window;
                return (
                  <button
                    key={window}
                    type="button"
                    onClick={() => {
                      setSelectedWindow(window);
                      setPrepared(false);
                    }}
                    aria-pressed={selected}
                    className={`button-press min-h-12 rounded-sm border px-2 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35 ${
                      selected ? "border-coral-deep bg-coral-deep text-white shadow-md" : "border-live-oak/15 bg-white text-live-oak hover:border-coral hover:bg-coral-soft"
                    }`}
                  >
                    {window}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <button
            type="button"
            disabled={!selectedDate || !selectedWindow}
            onClick={() => setPrepared(true)}
            className="button-press mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-coral-deep px-5 py-3 font-bold text-white shadow-[0_10px_25px_rgba(184,72,52,0.22)] transition hover:bg-live-oak focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Prepare my request
          </button>

          <div className="mt-5 min-h-[90px]" aria-live="polite">
            {prepared ? (
              <div className="border-y border-r border-l-4 border-live-oak/20 border-l-live-oak bg-sage/60 p-4">
                <p className="flex items-start gap-2 font-bold text-live-oak">
                  <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
                  {summary}
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground/70">The office will confirm the actual appointment time and availability.</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <a
                    href="tel:+19123493682"
                    className="button-press inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-live-oak px-4 py-2.5 font-bold text-white transition hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35"
                  >
                    <PhoneCall aria-hidden="true" className="h-4 w-4" />
                    Call to request
                  </a>
                  <button
                    type="button"
                    onClick={copyPreference}
                    className="button-press inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-live-oak/20 bg-white px-4 py-2.5 font-bold text-live-oak transition hover:bg-sage focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35"
                  >
                    <Clipboard aria-hidden="true" className="h-4 w-4" />
                    Copy preference
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
