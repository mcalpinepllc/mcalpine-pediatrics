/**
 * The Open Porch homepage: Southern editorial modernism, asymmetric storytelling,
 * practical reassurance, and the shortest possible path to care.
 */
import InsurancePlanner from "@/components/InsurancePlanner";
import ScheduleVisit from "@/components/ScheduleVisit";
import SiteHeader from "@/components/SiteHeader";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const careItems = [
  {
    title: "Newborn & infant care",
    copy: "A steady beginning for feeding, growth, sleep, safety, and early milestones.",
  },
  {
    title: "Well-child checkups",
    copy: "Thoughtful preventive visits that keep development and family questions in view.",
  },
  {
    title: "Sick visits",
    copy: "Clear guidance when your child is under the weather and you need a trusted next step.",
  },
  {
    title: "School-age & teen care",
    copy: "Age-appropriate support through changing bodies, growing independence, and big milestones.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-clip bg-porch text-foreground">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />

      <main id="main-content">
        <section id="home" className="paper-grain relative scroll-mt-24 overflow-hidden border-b border-live-oak/10 bg-porch">
          <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-coral/10 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute right-[4%] top-[16%] h-72 w-72 rounded-full bg-sage/65 blur-3xl" aria-hidden="true" />
          <div className="container grid min-h-[690px] items-center gap-12 py-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16 lg:py-16">
            <div className="section-reveal relative z-10 max-w-2xl py-4 lg:py-12">
              <p className="eyebrow flex items-center gap-2">
                <Sparkles aria-hidden="true" className="h-4 w-4 text-coral-deep" />
                Pediatrics · Savannah, Georgia
              </p>
              <h1 className="mt-6 max-w-[12ch] font-display text-[clamp(3rem,6.3vw,6.25rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-live-oak">
                Meet Dr. W. Esther McAlpine—<em className="font-normal text-coral-deep">the steady heart</em> families remember.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-foreground/72 sm:text-xl">
                For more than five decades, Savannah’s first Black woman pediatrician has cared for infants, children, adolescents, and the families growing alongside them.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#schedule"
                  className="button-press inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-coral-deep px-7 py-3.5 font-bold text-white shadow-[0_12px_30px_rgba(184,72,52,0.24)] transition hover:bg-live-oak focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35"
                >
                  Schedule a visit
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <a
                  href="tel:+19123493682"
                  className="button-press inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-live-oak/20 bg-white/75 px-7 py-3.5 font-bold text-live-oak shadow-sm backdrop-blur transition hover:border-coral hover:bg-coral-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35"
                >
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  Call (912) 349-3682
                </a>
              </div>
              <div className="mt-8 flex items-center gap-3 border-t border-live-oak/15 pt-5 text-sm font-semibold leading-6 text-live-oak/72">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-coral" aria-hidden="true" />
                Relationship-centered care, offered one family at a time.
              </div>
            </div>

            <div className="section-reveal section-reveal-delay mx-auto w-full max-w-[38rem] lg:mx-0">
              <div className="relative isolate mx-auto aspect-square w-full max-w-[36rem]">
                <div className="absolute inset-[2%] translate-x-[4%] translate-y-[4%] rounded-full bg-coral" aria-hidden="true" />
                <div className="absolute -inset-[3%] rounded-full border border-coral/35" aria-hidden="true" />
                <div className="absolute -right-[4%] top-[4%] h-[24%] w-[24%] rounded-full border border-live-oak/18 bg-porch/55" aria-hidden="true" />
                <figure className="relative h-full w-full overflow-hidden rounded-full border-[10px] border-white bg-sage shadow-[0_34px_90px_rgba(23,63,58,0.22)]">
                  <img
                    src="/manus-storage/mcalpine-portrait-stethoscope_e83fd3c3.png"
                    alt="Dr. W. Esther McAlpine smiling outdoors in a pink blouse with a stethoscope"
                    className="h-full w-full object-cover object-[50%_48%]"
                    fetchPriority="high"
                  />
                </figure>
              </div>
              <div className="mt-7 grid gap-4 border-y border-live-oak/18 py-5 sm:grid-cols-[1.2fr_0.8fr] sm:items-center sm:gap-6">
                <div className="flex items-center gap-4">
                  <img src="/manus-storage/mcalpine-heart-sprout-mark_73e5720e.png" alt="" className="h-11 w-11 shrink-0 object-contain" />
                  <div>
                    <p className="eyebrow">W. Esther McAlpine, M.D.</p>
                    <p className="mt-1 font-display text-xl font-semibold leading-tight text-live-oak">Pioneering care. Enduring presence.</p>
                  </div>
                </div>
                <div className="border-live-oak/15 sm:border-l sm:pl-6">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-foreground/50">A Savannah first</p>
                  <p className="mt-1 text-sm font-bold text-live-oak">50+ years in medicine</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Quick actions" className="relative z-10 -mt-px border-y border-live-oak/10 bg-white py-2 shadow-[0_16px_50px_rgba(23,63,58,0.06)]">
          <div className="container grid md:grid-cols-3">
            {[
              ["01", "Plan a visit", "Choose a date preference", "#schedule"],
              ["02", "Check coverage", "Plan for insurance & co-pay", "#insurance"],
              ["03", "Find the office", "340 Eisenhower Drive", "#visit"],
            ].map(([number, title, copy, href], index) => (
              <a
                key={number}
                href={href}
                className={`group relative flex items-center gap-4 border-live-oak/12 px-1 py-6 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35 md:px-8 ${index > 0 ? "border-t md:border-l md:border-t-0" : ""}`}
              >
                <span className="font-display text-2xl italic text-coral-deep" aria-hidden="true">{number}</span>
                <span>
                  <span className="block text-sm font-extrabold text-live-oak">{title}</span>
                  <span className="mt-1 block text-sm text-foreground/58">{copy}</span>
                </span>
                <span className="ml-auto h-px w-8 bg-coral transition-[width] duration-200 group-hover:w-12" aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section id="about" className="scroll-mt-24 bg-porch py-20 sm:py-28">
          <div className="container grid items-center gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <div className="mx-auto w-full max-w-lg">
              <div className="relative mx-auto max-w-[28rem]">
                <div className="absolute -inset-3 translate-x-4 translate-y-4 rounded-[48%_48%_2rem_2rem] bg-coral" aria-hidden="true" />
                <figure className="relative overflow-hidden rounded-[48%_48%_2rem_2rem] border-[8px] border-white bg-sage shadow-[0_28px_70px_rgba(23,63,58,0.16)]">
                  <img
                    src="/manus-storage/mcalpine-portrait-original_f9db1b16.webp"
                    alt="Dr. W. Esther McAlpine smiling outdoors in a pink blouse"
                    className="aspect-[4/5] h-full w-full object-cover object-[50%_28%]"
                    loading="lazy"
                  />
                </figure>
              </div>
              <div className="mt-8 grid grid-cols-2 divide-x divide-live-oak/15 border-y border-live-oak/15 py-4 text-center">
                <div className="px-3">
                  <p className="font-display text-3xl font-semibold text-coral-deep">50+</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.13em] text-live-oak/65">years in medicine</p>
                </div>
                <div className="px-3">
                  <p className="font-display text-3xl font-semibold text-live-oak">1974</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.13em] text-live-oak/65">medical degree</p>
                </div>
              </div>
            </div>

            <div>
              <p className="eyebrow">Meet Dr. W. Esther McAlpine</p>
              <h2 className="mt-5 max-w-[13ch] font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-live-oak sm:text-6xl">
                A Savannah first. A family constant.
              </h2>
              <div className="oak-divider my-7" aria-hidden="true" />
              <div className="space-y-5 text-[1.05rem] leading-8 text-foreground/72">
                <p>
                  Dr. Willie Esther McAlpine has cared for Savannah children across generations. After earning her medical degree from Case Western Reserve University School of Medicine in 1974, she built a career in pediatrics shaped by clinical experience, medical education, and community service.
                </p>
                <p>
                  Public professional listings identify her as a Clinical Assistant Professor at Mercer University School of Medicine and note affiliations with major Savannah-area hospitals. Her practice brings that depth of experience into a setting where parents can ask honest questions and children are treated with patience and dignity.
                </p>
                <p className="font-display text-2xl font-medium italic leading-9 text-coral-deep">
                  Part physician, part teacher, and—across the community—the steady heart families remember.
                </p>
              </div>
              <a href="#schedule" className="mt-8 inline-flex items-center gap-2 rounded-sm font-bold text-live-oak underline decoration-coral decoration-2 underline-offset-8 transition hover:text-coral-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35">
                Plan a visit with the practice
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section id="care" className="scroll-mt-24 bg-live-oak py-20 text-white sm:py-28">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <div>
                <p className="eyebrow text-coral">Care, simply explained</p>
                <h2 className="mt-5 max-w-[12ch] font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl">Here for the everyday and the important.</h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-white/68 lg:justify-self-end">
                Pediatric primary care should feel understandable. The practice supports children from their earliest days through adolescence, with a relationship that can grow alongside the family.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] bg-white/12 md:grid-cols-2 lg:grid-cols-4">
              {careItems.map((item, index) => {
                return (
                  <article key={item.title} className="group min-h-[260px] bg-live-oak p-7 transition-colors duration-200 hover:bg-[#214E47] sm:p-8">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-3xl italic text-coral">0{index + 1}</span>
                      <span className="h-px w-12 bg-white/20 transition-[width] duration-200 group-hover:w-20" aria-hidden="true" />
                    </div>
                    <h3 className="mt-10 font-display text-2xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/65">{item.copy}</p>
                  </article>
                );
              })}
            </div>
            <p className="mt-6 text-sm leading-6 text-white/55">Please call to confirm current services, visit types, and new-patient availability.</p>
          </div>
        </section>

        <section className="overflow-hidden bg-sage">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[420px] lg:min-h-[620px]">
              <img
                src="/manus-storage/mcalpine-community-children_aa36a8cd.png"
                alt="A diverse group of children playing together beneath live oak trees in a Savannah square"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex items-center px-6 py-16 sm:px-12 lg:px-20 lg:py-24">
              <div className="max-w-xl">
                <p className="eyebrow">The community mom</p>
                <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-live-oak sm:text-6xl">Growing healthy, together.</h2>
                <p className="mt-6 text-lg leading-8 text-foreground/70">
                  For families, pediatric care is never only about one appointment. It is about being seen, having a familiar place to turn, and knowing that someone is paying attention as your child changes.
                </p>
                <p className="mt-5 text-lg leading-8 text-foreground/70">
                  That generous, watchful spirit is why Dr. McAlpine is remembered not only as a caregiver, but as a mothering presence in the wider Savannah community.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="insurance" className="paper-grain scroll-mt-24 bg-porch py-20 sm:py-28">
          <div className="container grid items-start gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">Fewer surprises</p>
              <h2 className="mt-5 max-w-[12ch] font-display text-4xl font-semibold leading-[1.03] tracking-[-0.035em] text-live-oak sm:text-6xl">
                Insurance and co-pay, in plain language.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-foreground/70">
                Start with your carrier and the co-pay printed on your card. We will show what public provider directories report and the question to ask before your visit.
              </p>
              <div className="mt-8 flex items-start gap-4 rounded-2xl border border-live-oak/12 bg-white/70 p-5">
                <ShieldCheck aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-coral-deep" />
                <p className="text-sm leading-6 text-foreground/65">
                  Your card identifies the plan, but your insurer determines benefits. Deductibles, coinsurance, visit type, and network tier may change the final amount.
                </p>
              </div>
            </div>
            <InsurancePlanner />
          </div>
        </section>

        <section id="schedule" className="relative scroll-mt-24 overflow-hidden bg-sage px-0 py-16 sm:py-24">
          <div className="absolute inset-y-0 left-0 hidden w-[9%] bg-coral lg:block" aria-hidden="true" />
          <div className="absolute -right-24 top-12 h-80 w-80 rounded-full border border-coral/35" aria-hidden="true" />
          <div className="container relative">
            <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="eyebrow text-live-oak">Your next visit</p>
                <h2 className="mt-4 max-w-[14ch] font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-live-oak sm:text-6xl">Choose a time now. We’ll help with the details next.</h2>
              </div>
              <p className="max-w-md text-base leading-7 text-live-oak/75 lg:text-right">No diagnosis, symptoms, or medical history are requested online.</p>
            </div>
            <ScheduleVisit />
          </div>
        </section>

        <section id="visit" className="scroll-mt-24 bg-porch py-20 sm:py-28">
          <div className="container grid border-y border-live-oak/15 bg-white shadow-[0_24px_65px_rgba(23,63,58,0.09)] lg:grid-cols-[1.05fr_0.95fr] lg:border">
            <div className="p-6 sm:p-10 lg:p-14">
              <p className="eyebrow">Contact & directions</p>
              <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-live-oak sm:text-5xl">Come sit a while.</h2>
              <p className="mt-5 max-w-lg text-lg leading-8 text-foreground/68">
                The office is located on Eisenhower Drive in Savannah. Call before visiting for current hours, appointment availability, and plan confirmation.
              </p>

              <dl className="mt-9 space-y-6">
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage text-live-oak">
                    <Building2 aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.16em] text-foreground/50">Office</dt>
                    <dd className="mt-2 font-bold leading-7 text-live-oak">340 Eisenhower Drive<br />Building 700, Suite 740<br />Savannah, GA 31406</dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral-soft text-coral-deep">
                    <Phone aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.16em] text-foreground/50">Phone & fax</dt>
                    <dd className="mt-2 leading-7">
                      <a href="tel:+19123493682" className="block font-bold text-live-oak underline decoration-coral decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35">(912) 349-3682</a>
                      <span className="text-sm text-foreground/65">Fax: (912) 349-3683</span>
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=340+Eisenhower+Drive+Building+700+Suite+740+Savannah+GA+31406"
                  target="_blank"
                  rel="noreferrer"
                  className="button-press inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-live-oak px-6 py-3 font-bold text-white transition hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35"
                >
                  <MapPin aria-hidden="true" className="h-4 w-4" />
                  Open directions
                </a>
                <a
                  href="tel:+19123493682"
                  className="button-press inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-live-oak/20 bg-white px-6 py-3 font-bold text-live-oak transition hover:bg-sage focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35"
                >
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  Call the office
                </a>
              </div>
            </div>
            <div className="relative flex min-h-[390px] items-center overflow-hidden bg-live-oak p-8 text-white sm:p-12 lg:min-h-full lg:p-16">
              <div className="absolute -right-20 -top-28 h-[420px] w-[360px] rounded-t-full border-[2px] border-coral/55" aria-hidden="true" />
              <div className="absolute bottom-14 right-12 h-3 w-24 rounded-[100%_0_100%_0] bg-coral" aria-hidden="true" />
              <div className="relative max-w-md">
                <p className="eyebrow text-coral">Savannah, Georgia</p>
                <p className="mt-5 font-display text-[7rem] font-semibold leading-none tracking-[-0.08em] text-white sm:text-[9rem]">340</p>
                <div className="mt-4 h-px w-full bg-white/20" aria-hidden="true" />
                <p className="mt-6 font-display text-2xl leading-snug">Eisenhower Drive<br />Building 700 · Suite 740</p>
                <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">A familiar office address for generations of Savannah families—and an easy place to call before you come.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#102F2B] pb-24 pt-14 text-white sm:pb-10">
        <div className="container grid gap-10 md:grid-cols-[1.4fr_0.6fr] md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <img src="/manus-storage/mcalpine-heart-sprout-mark_73e5720e.png" alt="" className="h-12 w-12 object-contain" />
              <div>
                <p className="font-display text-xl font-semibold">W. Esther McAlpine, M.D., P.C.</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/55">Pediatrics · Savannah, Georgia</p>
              </div>
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/58">
              This website does not provide medical advice. If your child is experiencing a medical emergency, call 911. Do not send symptoms, diagnoses, or other private health information through unsecured channels.
            </p>
          </div>
          <div className="text-sm leading-7 text-white/58 md:text-right">
            <p>340 Eisenhower Drive, Bldg. 700, Ste. 740</p>
            <p>Savannah, Georgia 31406</p>
            <a href="tel:+19123493682" className="font-bold text-white underline decoration-coral decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35">(912) 349-3682</a>
          </div>
        </div>
        <div className="container mt-10 border-t border-white/10 pt-6 text-xs leading-6 text-white/40">
          <p>© {new Date().getFullYear()} W. Esther McAlpine, M.D., P.C. Practice details and insurance participation should be confirmed before publication.</p>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-live-oak/12 bg-porch/96 p-2 shadow-[0_-10px_32px_rgba(23,63,58,0.12)] backdrop-blur-xl sm:hidden" aria-label="Quick contact actions">
        <div className="grid grid-cols-2 gap-2">
          <a href="tel:+19123493682" className="button-press inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-live-oak/15 bg-white font-bold text-live-oak focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35">
            <Phone aria-hidden="true" className="h-4 w-4" />
            Call office
          </a>
          <a href="#schedule" className="button-press inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-coral-deep font-bold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35">
            <CalendarCheck aria-hidden="true" className="h-4 w-4" />
            Schedule
          </a>
        </div>
      </div>
    </div>
  );
}
