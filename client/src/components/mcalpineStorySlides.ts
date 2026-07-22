export type StorySlide = {
  src: string;
  alt: string;
  label: string;
  caption: string;
  position: string;
  href?: string;
  fit?: "cover" | "contain";
  scale?: number;
  transformOrigin?: string;
};

export const slides: StorySlide[] = [
  {
    src: "/manus-storage/mcalpine-red-coat-care_460dcba6.jpg",
    alt: "Dr. McAlpine in a red clinical coat listening to a smiling young child with a stethoscope.",
    label: "A tradition of health care with heart",
    caption: "Patient service in Savannah, Ga.",
    position: "center",
    fit: "contain",
    scale: 1.5,
    transformOrigin: "center",
  },
  {
    src: "/manus-storage/mcalpine-honduras_2b0e463e.jpg",
    alt: "Dr. McAlpine smiling in blue scrubs beneath road signs in Honduras.",
    label: "International service",
    caption: 'Helping in Honduras with Medical Wings International Inc. ("Wings").',
    position: "center",
    href: "https://www.medicalwings.org/",
  },
  {
    src: "/manus-storage/mcalpine-india_9d514676.jpg",
    alt: "Dr. McAlpine with fellow physicians in front of the Taj Mahal in India.",
    label: "Serving across borders",
    caption: "With fellow physicians in India with Wings.",
    position: "center",
  },
  {
    src: "/manus-storage/mcalpine-community-event_f4f608cf.webp",
    alt: "Dr. McAlpine volunteering for voters beneath a blue canopy in Chatham County.",
    label: "Close to home",
    caption: "Volunteering for votes in Chatham County",
    position: "center top",
    fit: "contain",
    scale: 1.5,
    transformOrigin: "center top",
  },
  {
    src: "/manus-storage/mcalpine-historical-portrait_920b241d.jpg",
    alt: "Historical studio portrait of Dr. McAlpine in a teal jacket.",
    label: "Through the years",
    caption: "Serving Savannah since 1974",
    position: "center 28%",
  },
  {
    src: "/manus-storage/mcalpine-brown-jacket-portrait_acbeb4c4.jpg",
    alt: "Earlier portrait of Dr. McAlpine smiling in a brown jacket.",
    label: "Through the years",
    caption: "Serving since 1974.",
    position: "center",
    fit: "contain",
  },
  {
    src: "/manus-storage/mcalpine-thailand-tsunami_00e1c4e8.jpg",
    alt: "Medical volunteers caring for children at a tsunami-relief clinic in Phuket, Thailand.",
    label: "Tsunami relief",
    caption: "Problem solving in Phuket with Wings.",
    position: "center",
  },
  {
    src: "/manus-storage/mcalpine-senegal-outreach_e8d9ceb9.jpg",
    alt: "Children and volunteers gathered during an outreach visit in Dakar, Senegal.",
    label: "African outreach",
    caption: "Delivering smiles in Dakar, Senegal with Wings.",
    position: "center",
  },
];
