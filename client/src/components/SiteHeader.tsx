/**
 * The Open Porch header: a composed editorial wordmark, generous touch targets,
 * and one unmistakable scheduling action in McAlpine Coral.
 */
import { Button } from "@/components/ui/button";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "#about", label: "Meet Dr. McAlpine" },
  { href: "#care", label: "Care" },
  { href: "#insurance", label: "Insurance & Co-Pay" },
  { href: "#visit", label: "Visit" },
  { href: "/portal", label: "Patient Portal" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-live-oak/10 bg-porch/95 text-foreground shadow-[0_8px_30px_rgba(23,63,58,0.06)] backdrop-blur-xl">
      <div className="container flex min-h-[76px] items-center justify-between gap-4 py-3">
        <a
          href="#home"
          className="group flex min-w-0 items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35"
          aria-label="W. Esther McAlpine, M.D., P.C. home"
        >
          <img
            src="/manus-storage/mcalpine-sprouting-heart-a_851d8ff5.png"
            alt=""
            className="h-11 w-11 shrink-0 object-contain transition-transform duration-200 group-hover:-rotate-2 group-hover:scale-105 sm:h-12 sm:w-12"
          />
          <span className="min-w-0 leading-none">
            <span className="block truncate font-display text-[1.04rem] tracking-[-0.03em] text-live-oak sm:text-[1.22rem]">
              <span className="font-medium italic text-coral-deep">W. Esther</span>{" "}
              <span className="font-semibold">McAlpine</span>
            </span>
            <span className="mt-1.5 block truncate text-[0.58rem] font-extrabold uppercase tracking-[0.22em] text-foreground/62 sm:text-[0.63rem]">
              M.D., P.C. <span className="px-1 text-coral" aria-hidden="true">/</span> Pediatrics
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={link.href === "/portal" ? "button-press rounded-full bg-live-oak px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(23,63,58,0.18)] transition hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35" : "rounded-sm px-1 py-2 text-sm font-semibold text-live-oak/80 underline-offset-8 transition-colors duration-200 hover:text-coral-deep hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35"}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Button asChild variant="ghost" className="hidden text-live-oak xl:inline-flex">
            <a href="tel:+19123493682" aria-label="Call the office at 912-349-3682">
              <Phone aria-hidden="true" className="mr-2 h-4 w-4" />
              (912) 349-3682
            </a>
          </Button>
          <Button asChild className="button-press rounded-full bg-coral-deep px-5 font-bold text-white shadow-[0_8px_22px_rgba(184,72,52,0.22)] hover:bg-live-oak">
            <a href="#schedule">Schedule a visit</a>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-live-oak/15 bg-white text-live-oak shadow-sm transition-colors hover:bg-sage focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35 sm:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {open ? (
        <nav id="mobile-navigation" className="border-t border-live-oak/10 bg-porch px-4 pb-5 pt-3 sm:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={link.href === "/portal" ? "rounded-xl bg-live-oak px-4 py-3.5 text-center text-base font-bold text-white hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35" : "rounded-xl px-4 py-3.5 text-base font-bold text-live-oak hover:bg-sage focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35"}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#schedule"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-coral-deep px-4 py-3.5 text-center font-bold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35"
            >
              Schedule a visit
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
