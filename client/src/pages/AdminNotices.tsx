import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Archive, Bell, CalendarClock, Loader2, ShieldAlert } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

const statusFor = (notice: {
  archivedAt: Date | null;
  publishedAt: Date;
  expiresAt: Date | null;
}) => {
  const now = new Date();
  if (notice.archivedAt) return "Archived";
  if (notice.publishedAt > now) return "Scheduled";
  if (notice.expiresAt && notice.expiresAt <= now) return "Expired";
  return "Published";
};

export default function AdminNotices() {
  const { user, loading } = useAuth();
  const utils = trpc.useUtils();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState<"routine" | "important">("routine");
  const [expiresAt, setExpiresAt] = useState("");
  const [confirmedNonClinical, setConfirmedNonClinical] = useState(false);
  const notices = trpc.notices.adminList.useQuery(undefined, {
    enabled: user?.role === "admin",
    retry: false,
  });
  const createNotice = trpc.notices.create.useMutation({
    onSuccess: async () => {
      setTitle("");
      setBody("");
      setPriority("routine");
      setExpiresAt("");
      setConfirmedNonClinical(false);
      await Promise.all([utils.notices.adminList.invalidate(), utils.notices.inbox.invalidate()]);
      toast.success("Practice notice published");
    },
    onError: () => toast.error("The notice could not be published"),
  });
  const archiveNotice = trpc.notices.archive.useMutation({
    onSuccess: async () => {
      await Promise.all([utils.notices.adminList.invalidate(), utils.notices.inbox.invalidate()]);
      toast.success("Notice archived");
    },
    onError: () => toast.error("The notice could not be archived"),
  });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createNotice.mutate({
      title,
      body,
      priority,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      confirmedNonClinical: true,
    });
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl py-4 sm:p-5">
        {loading ? (
          <div className="flex min-h-[55vh] items-center justify-center" aria-busy="true"><Loader2 aria-hidden="true" className="h-6 w-6 animate-spin text-coral-deep" /></div>
        ) : user?.role !== "admin" ? (
          <section className="mx-auto mt-16 max-w-xl rounded-[2rem] border border-coral/25 bg-white p-8 text-center shadow-[0_24px_65px_rgba(23,63,58,0.08)]">
            <ShieldAlert aria-hidden="true" className="mx-auto h-10 w-10 text-coral-deep" />
            <h1 className="mt-5 font-display text-3xl font-semibold text-live-oak">Clinician access only</h1>
            <p className="mt-3 leading-7 text-foreground/65">Your account can read patient-facing notices but cannot publish or archive them.</p>
            <Link href="/portal" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-live-oak px-5 font-bold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35">Return to patient portal</Link>
          </section>
        ) : (
          <>
            <header className="border-b border-live-oak/15 pb-8">
              <p className="eyebrow">Clinician workspace</p>
              <h1 className="mt-3 font-display text-4xl font-semibold text-live-oak sm:text-5xl">Practice notices</h1>
              <p className="mt-3 max-w-3xl leading-7 text-foreground/65">Publish office-wide, non-clinical announcements only. Never enter a patient name, symptom, diagnosis, treatment detail, medical record, or private message.</p>
            </header>

            <div className="mt-9 grid gap-8 xl:grid-cols-[0.82fr_1.18fr] xl:items-start">
              <section className="rounded-[2rem] border border-live-oak/12 bg-white p-6 shadow-[0_18px_55px_rgba(23,63,58,0.07)] sm:p-8" aria-labelledby="compose-heading">
                <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-coral-soft text-coral-deep"><Bell aria-hidden="true" className="h-5 w-5" /></span><h2 id="compose-heading" className="font-display text-2xl font-semibold text-live-oak">Write a notice</h2></div>
                <form onSubmit={submit} className="mt-7 space-y-5">
                  <div>
                    <label htmlFor="notice-title" className="text-sm font-bold text-live-oak">Title</label>
                    <input id="notice-title" value={title} onChange={event => setTitle(event.target.value)} required minLength={3} maxLength={160} className="mt-2 min-h-12 w-full rounded-xl border border-live-oak/18 bg-porch px-4 outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/18" />
                  </div>
                  <div>
                    <label htmlFor="notice-body" className="text-sm font-bold text-live-oak">General announcement</label>
                    <textarea id="notice-body" value={body} onChange={event => setBody(event.target.value)} required minLength={3} maxLength={5000} rows={7} aria-describedby="notice-boundary" className="mt-2 w-full rounded-xl border border-live-oak/18 bg-porch px-4 py-3 outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/18" />
                    <p id="notice-boundary" className="mt-2 text-xs leading-5 text-foreground/55">No patient-specific or clinical information. Plain text only.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="notice-priority" className="text-sm font-bold text-live-oak">Priority</label>
                      <select id="notice-priority" value={priority} onChange={event => setPriority(event.target.value as "routine" | "important")} className="mt-2 min-h-12 w-full rounded-xl border border-live-oak/18 bg-porch px-4 outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/18"><option value="routine">Routine</option><option value="important">Important</option></select>
                    </div>
                    <div>
                      <label htmlFor="notice-expires" className="text-sm font-bold text-live-oak">Expires (optional)</label>
                      <input id="notice-expires" type="datetime-local" value={expiresAt} onChange={event => setExpiresAt(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-live-oak/18 bg-porch px-4 outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/18" />
                    </div>
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-coral/25 bg-coral-soft/55 p-4 text-sm leading-6 text-foreground/72">
                    <input type="checkbox" required checked={confirmedNonClinical} onChange={event => setConfirmedNonClinical(event.target.checked)} className="mt-1 h-4 w-4 accent-[#B84834]" />
                    <span><strong className="text-live-oak">Non-clinical confirmation:</strong> this announcement contains no patient name, symptom, diagnosis, treatment detail, medical record, or private message.</span>
                  </label>
                  <button type="submit" disabled={createNotice.isPending || !confirmedNonClinical} className="button-press inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-coral-deep px-5 font-bold text-white transition hover:bg-live-oak focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35 disabled:cursor-not-allowed disabled:opacity-60">
                    {createNotice.isPending ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Bell aria-hidden="true" className="h-4 w-4" />}Publish to portal
                  </button>
                </form>
              </section>

              <section aria-labelledby="published-heading">
                <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Notice history</p><h2 id="published-heading" className="mt-2 font-display text-3xl font-semibold text-live-oak">Published and archived</h2></div></div>
                {notices.isLoading ? (
                  <div className="mt-6 rounded-3xl border border-live-oak/12 bg-white p-8" aria-busy="true"><Loader2 aria-hidden="true" className="h-5 w-5 animate-spin text-coral-deep" /></div>
                ) : notices.error ? (
                  <div role="alert" className="mt-6 rounded-3xl border border-coral/25 bg-coral-soft p-6 font-bold text-coral-deep">Notice history could not be loaded.</div>
                ) : !notices.data?.length ? (
                  <div className="mt-6 rounded-3xl border border-live-oak/12 bg-white p-8"><p className="font-display text-2xl font-semibold text-live-oak">No notices yet.</p><p className="mt-2 text-sm leading-6 text-foreground/60">The first notice you publish will appear here and in each signed-in patient’s inbox.</p></div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {notices.data.map(notice => {
                      const status = statusFor(notice);
                      return (
                        <article key={notice.id} className="rounded-3xl border border-live-oak/12 bg-white p-6 shadow-[0_14px_40px_rgba(23,63,58,0.05)]">
                          <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-sage px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.13em] text-live-oak">{status}</span>{notice.priority === "important" ? <span className="rounded-full bg-coral-soft px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.13em] text-coral-deep">Important</span> : null}</div>
                          <h3 className="mt-4 font-display text-2xl font-semibold text-live-oak">{notice.title}</h3>
                          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-foreground/68">{notice.body}</p>
                          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-live-oak/10 pt-4 text-xs font-semibold text-foreground/50"><span className="inline-flex items-center gap-2"><CalendarClock aria-hidden="true" className="h-4 w-4" />{notice.publishedAt.toLocaleString()}</span>{!notice.archivedAt ? <button type="button" onClick={() => archiveNotice.mutate({ noticeId: notice.id })} disabled={archiveNotice.isPending} className="inline-flex min-h-9 items-center gap-2 rounded-full px-3 font-bold text-coral-deep transition hover:bg-coral-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35 disabled:opacity-55"><Archive aria-hidden="true" className="h-4 w-4" />Archive</button> : null}</div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
