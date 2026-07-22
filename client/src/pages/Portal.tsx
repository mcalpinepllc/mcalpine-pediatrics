import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Bell,
  Check,
  ExternalLink,
  Loader2,
  LockKeyhole,
  LogOut,
  ShieldCheck,
  Video,
} from "lucide-react";
import { Link } from "wouter";

function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="paper-grain min-h-screen bg-porch text-foreground">
      <a href="#portal-content" className="skip-link">Skip to portal content</a>
      <header className="border-b border-live-oak/12 bg-white/82 backdrop-blur-xl">
        <div className="container flex min-h-20 items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35">
            <img src="/manus-storage/mcalpine-sprouting-heart-a_851d8ff5.png" alt="" className="h-11 w-11 object-contain" />
            <span>
              <span className="block font-display text-lg font-semibold text-live-oak">The Open Porch</span>
              <span className="block text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-foreground/55">Patient portal</span>
            </span>
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-live-oak/15 bg-white px-4 text-sm font-bold text-live-oak transition hover:bg-sage focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Practice website
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}

export default function Portal() {
  const { user, loading, logout } = useAuth();
  const utils = trpc.useUtils();
  const inbox = trpc.notices.inbox.useQuery(undefined, {
    enabled: Boolean(user),
    retry: false,
  });
  const markViewed = trpc.notices.markViewed.useMutation({
    onSuccess: () => utils.notices.inbox.invalidate(),
  });
  const telehealth = trpc.telehealth.launch.useMutation();

  if (loading) {
    return (
      <PortalShell>
        <main id="portal-content" className="container flex min-h-[65vh] items-center justify-center py-16" aria-busy="true">
          <p className="inline-flex items-center gap-3 font-bold text-live-oak"><Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />Checking your secure sign-in…</p>
        </main>
      </PortalShell>
    );
  }

  if (!user) {
    return (
      <PortalShell>
        <main id="portal-content" className="container grid min-h-[calc(100vh-81px)] items-center gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <section>
            <p className="eyebrow">A simple, private doorway</p>
            <h1 className="mt-5 max-w-[11ch] font-display text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-live-oak sm:text-7xl">Practice notices and telehealth, in one place.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-foreground/70">Sign in to read general practice updates and continue to Dr. McAlpine’s Doxy.me waiting room. This portal does not collect medical records, symptoms, diagnoses, or clinical messages.</p>
            <button type="button" onClick={() => startLogin("/portal")} className="button-press mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-coral-deep px-7 py-3.5 font-bold text-white shadow-[0_12px_30px_rgba(184,72,52,0.22)] transition hover:bg-live-oak focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35">
              <LockKeyhole aria-hidden="true" className="h-5 w-5" />
              Sign in to the portal
            </button>
          </section>
          <aside className="relative overflow-hidden rounded-[2rem] bg-live-oak p-8 text-white shadow-[0_30px_80px_rgba(23,63,58,0.18)] sm:p-12">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-coral/45" aria-hidden="true" />
            <ShieldCheck aria-hidden="true" className="h-10 w-10 text-coral" />
            <h2 className="mt-7 font-display text-3xl font-semibold">What belongs here</h2>
            <div className="mt-6 space-y-5 text-sm leading-7 text-white/72">
              <p><strong className="text-white">Practice notices:</strong> office schedules, closures, and non-clinical announcements.</p>
              <p><strong className="text-white">Telehealth handoff:</strong> a direct link to Doxy.me, where the visit takes place.</p>
              <p><strong className="text-white">Not medical advice:</strong> call 911 for an emergency and call the office for clinical questions.</p>
            </div>
          </aside>
        </main>
      </PortalShell>
    );
  }

  const notices = inbox.data?.notices ?? [];

  const launchTelehealth = async () => {
    const result = await telehealth.mutateAsync();
    window.location.assign(result.url);
  };

  return (
    <PortalShell>
      <main id="portal-content" className="container py-12 sm:py-16">
        <div className="flex flex-col gap-6 border-b border-live-oak/15 pb-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-live-oak sm:text-5xl">Hello, {user.name?.split(" ")[0] || "there"}.</h1>
            <p className="mt-3 max-w-2xl leading-7 text-foreground/65">Read practice-wide notices or continue to the external telehealth waiting room. Do not enter medical information on this website.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.role === "admin" ? (
              <Link href="/admin/notices" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-live-oak/18 bg-white px-4 text-sm font-bold text-live-oak transition hover:bg-sage focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35">
                <Bell aria-hidden="true" className="h-4 w-4" />Manage notices
              </Link>
            ) : null}
            <button type="button" onClick={() => void logout()} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold text-live-oak transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35">
              <LogOut aria-hidden="true" className="h-4 w-4" />Sign out
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <section aria-labelledby="notice-heading">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">From the practice</p>
                <h2 id="notice-heading" className="mt-2 font-display text-3xl font-semibold text-live-oak">Notice inbox</h2>
              </div>
              {inbox.data ? <span className="rounded-full bg-coral-soft px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-coral-deep">{inbox.data.unreadCount} unread</span> : null}
            </div>

            {inbox.isLoading ? (
              <div className="mt-6 rounded-3xl border border-live-oak/12 bg-white p-8" aria-busy="true"><p className="inline-flex items-center gap-3 font-bold text-live-oak"><Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />Loading notices…</p></div>
            ) : inbox.error ? (
              <div role="alert" className="mt-6 rounded-3xl border border-coral/25 bg-coral-soft p-7"><p className="font-bold text-coral-deep">Notices could not be loaded.</p><p className="mt-2 text-sm leading-6 text-foreground/70">Please refresh or call the office at (912) 349-3682.</p></div>
            ) : notices.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-live-oak/12 bg-white p-8 shadow-[0_18px_50px_rgba(23,63,58,0.06)]"><Bell aria-hidden="true" className="h-7 w-7 text-coral-deep" /><h3 className="mt-5 font-display text-2xl font-semibold text-live-oak">You’re all caught up.</h3><p className="mt-2 leading-7 text-foreground/65">There are no current practice notices.</p></div>
            ) : (
              <div className="mt-6 space-y-4">
                {notices.map(notice => {
                  const unread = !notice.viewedAt;
                  return (
                    <article key={notice.id} className={`rounded-3xl border bg-white p-6 shadow-[0_16px_45px_rgba(23,63,58,0.06)] sm:p-7 ${unread ? "border-coral/45" : "border-live-oak/12"}`}>
                      <div className="flex flex-wrap items-center gap-2">
                        {unread ? <span className="rounded-full bg-coral-deep px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-white">New</span> : null}
                        {notice.priority === "important" ? <span className="rounded-full bg-sage px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-live-oak">Important</span> : null}
                        <time className="text-xs font-semibold text-foreground/48" dateTime={notice.publishedAt.toISOString()}>{notice.publishedAt.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</time>
                      </div>
                      <h3 className="mt-4 font-display text-2xl font-semibold text-live-oak">{notice.title}</h3>
                      <p className="mt-3 whitespace-pre-line leading-7 text-foreground/70">{notice.body}</p>
                      {unread ? (
                        <button type="button" disabled={markViewed.isPending} onClick={() => markViewed.mutate({ noticeId: notice.id })} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-live-oak/15 px-4 text-sm font-bold text-live-oak transition hover:bg-sage focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35 disabled:opacity-55">
                          <Check aria-hidden="true" className="h-4 w-4" />Mark as read
                        </button>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="lg:sticky lg:top-8">
            <div className="relative overflow-hidden rounded-[2rem] bg-live-oak p-7 text-white shadow-[0_24px_65px_rgba(23,63,58,0.16)] sm:p-9">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-coral/45" aria-hidden="true" />
              <Video aria-hidden="true" className="h-9 w-9 text-coral" />
              <p className="eyebrow mt-7 text-coral">Friday telehealth</p>
              <h2 className="mt-3 font-display text-3xl font-semibold">Visit Dr. McAlpine on Doxy.me.</h2>
              <p className="mt-4 text-sm leading-7 text-white/70">By appointment, Friday from 10:00 AM–12:00 PM. Doxy.me opens outside this website and handles the telehealth visit.</p>
              <Dialog>
                <DialogTrigger asChild>
                  <button type="button" className="button-press mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-coral px-5 font-bold text-white transition hover:bg-white hover:text-live-oak focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/45">
                    <Video aria-hidden="true" className="h-4 w-4" />
                    Start telemedicine session
                  </button>
                </DialogTrigger>
                <DialogContent className="border-live-oak/15 bg-porch text-foreground sm:max-w-xl">
                  <DialogHeader>
                    <DialogTitle className="font-display text-3xl font-semibold text-live-oak">Continue to Dr. McAlpine’s Doxy.me waiting room?</DialogTitle>
                    <DialogDescription className="pt-2 text-sm leading-7 text-foreground/68">Your visit takes place on Doxy.me, outside this patient portal. Doxy.me may request your name and permission to use your camera and microphone. Do not enter symptoms or other medical details on this website.</DialogDescription>
                  </DialogHeader>
                  {telehealth.error ? <p role="alert" className="rounded-2xl bg-coral-soft p-4 text-sm font-semibold text-coral-deep">The handoff did not open. Please call (912) 349-3682.</p> : null}
                  <DialogFooter className="mt-3">
                    <DialogClose asChild>
                      <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-full border border-live-oak/18 bg-white px-5 font-bold text-live-oak focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35">Not now</button>
                    </DialogClose>
                    <button type="button" onClick={() => void launchTelehealth()} disabled={telehealth.isPending} className="button-press inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-live-oak px-5 font-bold text-white transition hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35 disabled:opacity-60">
                      {telehealth.isPending ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <ExternalLink aria-hidden="true" className="h-4 w-4" />}
                      Continue to Doxy.me
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-5 rounded-3xl border border-live-oak/12 bg-white p-6">
              <p className="flex items-center gap-2 font-bold text-live-oak"><ShieldCheck aria-hidden="true" className="h-5 w-5 text-coral-deep" />Privacy boundary</p>
              <p className="mt-3 text-sm leading-6 text-foreground/65">This portal stores only general practice notices and whether you marked them read. Clinical information belongs in Doxy.me or a direct conversation with the office.</p>
            </div>
          </aside>
        </div>
      </main>
    </PortalShell>
  );
}
