import { describe, expect, it } from "vitest";
import { slides } from "../client/src/components/mcalpineStorySlides";

describe("Dr. McAlpine picture roll", () => {
  it("uses the requested eight-slide order and first-slide copy", () => {
    expect(slides).toHaveLength(8);
    expect(slides[0]).toMatchObject({
      src: "/manus-storage/mcalpine-red-coat-care_460dcba6.jpg",
      label: "A tradition of health care with heart",
      caption: "Patient service in Savannah, Ga.",
    });
  });

  it("preserves the Wings link, expanded Chatham crop, and two Through the Years portraits", () => {
    expect(slides[1].href).toBe("https://www.medicalwings.org/");
    expect(slides[3].fit).toBe("contain");
    expect(slides.filter(slide => slide.label === "Through the years")).toHaveLength(2);
  });

  it("uses the cropped Thailand and Senegal assets and excludes the removed pink-jacket photo", () => {
    expect(slides.some(slide => slide.src.includes("thailand-tsunami"))).toBe(true);
    expect(slides.some(slide => slide.src.includes("senegal-outreach"))).toBe(true);
    expect(slides.some(slide => slide.src.includes("pink-jacket"))).toBe(false);
  });
});
