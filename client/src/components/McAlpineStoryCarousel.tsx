import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Camera, Globe2 } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/manus-storage/mcalpine-honduras_2b0e463e.jpg",
    alt: "Dr. McAlpine smiling in blue scrubs beneath road signs in Honduras.",
    label: "International service",
    caption: "On the road in Honduras",
    position: "center",
  },
  {
    src: "/manus-storage/mcalpine-india_9d514676.jpg",
    alt: "Dr. McAlpine with a group of international service travelers in front of the Taj Mahal in India.",
    label: "Across borders",
    caption: "With fellow travelers in India",
    position: "center",
  },
  {
    src: "/manus-storage/mcalpine-community-event_f4f608cf.webp",
    alt: "Close-up portrait of Dr. McAlpine smiling beneath a blue canopy at a Chatham County event.",
    label: "Close to home",
    caption: "At a Chatham County community event",
    position: "center 34%",
  },
  {
    src: "/manus-storage/mcalpine-pink-jacket_50e03034.webp",
    alt: "Dr. McAlpine smiling outdoors in a bright pink jacket.",
    label: "A familiar smile",
    caption: "Dr. McAlpine in the Savannah sunshine",
    position: "center 32%",
  },
  {
    src: "/manus-storage/mcalpine-historical-portrait_920b241d.jpg",
    alt: "Historical studio portrait of Dr. McAlpine in a teal jacket.",
    label: "Across the years",
    caption: "An earlier portrait of Dr. McAlpine",
    position: "center 28%",
  },
];

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
            <p className="eyebrow mt-6 text-coral">Across years and places</p>
            <h3 id="story-gallery-title" className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">A life of care, in five photographs.</h3>
            <p className="mt-5 text-sm leading-7 text-white/68">Use the arrow buttons or your keyboard’s left and right arrows. The slideshow does not advance automatically.</p>
            <p className="mt-7 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-white/55"><Camera aria-hidden="true" className="h-4 w-4" />Client-supplied photographs</p>
          </div>
        </div>

        <div className="min-w-0 bg-[#102F2B] p-4 sm:p-6 lg:p-8">
          <Carousel setApi={setApi} opts={{ align: "start" }} aria-label="Dr. McAlpine photo stories" className="mx-auto max-w-4xl">
            <CarouselContent className="ml-0">
              {slides.map((slide, index) => (
                <CarouselItem key={slide.src} className="pl-0" aria-label={`${index + 1} of ${slides.length}`}>
                  <figure className="relative aspect-[4/4.35] overflow-hidden rounded-[1.45rem] bg-sage sm:aspect-[16/11]">
                    <img src={slide.src} alt={slide.alt} className="h-full w-full object-cover" style={{ objectPosition: slide.position }} loading={index === 0 ? "eager" : "lazy"} />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#102F2B] via-[#102F2B]/78 to-transparent px-5 pb-5 pt-16 sm:px-7 sm:pb-7">
                      <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-coral">{slide.label}</span>
                      <span className="mt-1 block font-display text-xl font-semibold sm:text-2xl">{slide.caption}</span>
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
