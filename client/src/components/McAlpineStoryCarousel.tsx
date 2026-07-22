import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Globe2 } from "lucide-react";
import { useEffect, useState } from "react";
import { slides } from "./mcalpineStorySlides";

export default function McAlpineStoryCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const update = () => setCurrent(api.selectedScrollSnap());
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <section aria-labelledby="story-gallery-title" className="overflow-hidden rounded-[2rem] bg-live-oak text-white shadow-[0_30px_85px_rgba(23,63,58,0.17)]">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="relative flex items-center p-7 sm:p-10 lg:p-12">
          <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full border border-coral/38" aria-hidden="true" />
          <div className="relative">
            <Globe2 aria-hidden="true" className="h-9 w-9 text-coral" />
            <h3 id="story-gallery-title" className="mt-6 font-display text-3xl font-semibold leading-tight sm:text-4xl">A lifetime of care and caring at home and abroad.</h3>
            <p className="mt-5 text-sm leading-7 text-white/68">Use the arrow buttons or your keyboard’s left and right arrows. The slideshow does not advance automatically.</p>
          </div>
        </div>

        <div className="min-w-0 bg-[#102F2B] p-4 sm:p-6 lg:p-8">
          <Carousel
            setApi={setApi}
            opts={{ align: "start" }}
            aria-label="Dr. McAlpine photo stories"
            tabIndex={0}
            className="mx-auto max-w-4xl rounded-[1.45rem] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/55 focus-visible:ring-offset-4 focus-visible:ring-offset-[#102F2B]"
          >
            <CarouselContent className="ml-0">
              {slides.map((slide, index) => (
                <CarouselItem key={slide.src} className="pl-0" aria-label={`${index + 1} of ${slides.length}`}>
                  <figure className="relative aspect-[4/4.35] overflow-hidden rounded-[1.45rem] bg-sage sm:aspect-[16/11]">
                    <img src={slide.src} alt={slide.alt} className={`h-full w-full bg-[#102F2B] ${slide.fit === "contain" ? "object-contain pb-24" : "object-cover"}`} style={{ objectPosition: slide.position, transform: slide.scale ? `scale(${slide.scale})` : undefined, transformOrigin: slide.transformOrigin }} loading={index === 0 ? "eager" : "lazy"} />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#102F2B] via-[#102F2B]/78 to-transparent px-5 pb-5 pt-16 sm:px-7 sm:pb-7">
                      <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-coral">{slide.label}</span>
                      {slide.href ? (
                        <a href={slide.href} target="_blank" rel="noreferrer" className="mt-1 block font-display text-xl font-semibold underline decoration-coral/75 decoration-2 underline-offset-4 transition hover:text-coral sm:text-2xl">
                          {slide.caption}
                        </a>
                      ) : (
                        <span className="mt-1 block font-display text-xl font-semibold sm:text-2xl">{slide.caption}</span>
                      )}
                    </figcaption>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-3 h-11 w-11 border-white/30 bg-white text-live-oak shadow-lg hover:bg-coral-soft" />
            <CarouselNext className="right-3 h-11 w-11 border-white/30 bg-white text-live-oak shadow-lg hover:bg-coral-soft" />
          </Carousel>

          <div className="mt-4 flex items-center justify-between gap-4 px-1">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/55" aria-live="polite">Photo {current + 1} of {slides.length}</p>
            <div className="flex gap-2" aria-label="Choose a photo">
              {slides.map((slide, index) => (
                <button key={slide.src} type="button" onClick={() => api?.scrollTo(index)} aria-label={`Show photo ${index + 1}: ${slide.caption}`} aria-current={current === index ? "true" : undefined} className={`h-2.5 rounded-full transition-[width,background-color] duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/45 ${current === index ? "w-8 bg-coral" : "w-2.5 bg-white/35 hover:bg-white/65"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
