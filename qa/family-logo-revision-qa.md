# Family Hero and Logo Revision QA

The revised desktop page was reviewed at **1440 × 1000**. The homepage hero now shows the expanded office-arrival scene with both mothers and both children visible, while Dr. McAlpine’s circular stethoscope portrait appears in the Meet section. The approved relationship-centered sentence is present beneath the hero headline, and no text overlays a person’s face.

The selected replacement emblem was also reviewed at full resolution. It reads immediately as a **wide coral heart with two rounded lobes, a conventional heart point, and a small two-leaf green sprout rising above the center cleft**. It contains no enclosing arch, dangling form, internal figure, or anatomical silhouette.

| Check | Result |
| --- | --- |
| Inclusive family hero composition | Pass |
| Circular stethoscope portrait moved to Meet section | Pass |
| Non-stethoscope portrait removed from rendered page | Pass |
| Approved supporting copy restored exactly | Pass |
| New emblem clearly reads as heart plus sprout | Pass |
| Desktop composition remains aligned with The Open Porch | Pass |
| Independent style review | Strong; no blocking issue identified |

The mobile page was reviewed at **390 × 844**. The family hero stacks below the copy without cropping out any family member, the circular Dr. McAlpine portrait remains centered in the Meet section, and the new heart-and-sprout mark remains recognizable in the compact header and footer lockups. The live-page text extraction confirms the exact approved supporting sentence, descriptive alternative text for both principal images, one page-level heading, skip navigation, named links, labeled form controls, and functioning internal anchors.

A deterministic DOM check found one `h1`, one `main`, one primary `nav`, no duplicate IDs, no unnamed interactive controls, and no images lacking `alt` attributes. The old emblem and non-stethoscope portrait are absent. Both principal images and the new emblem loaded at their expected intrinsic dimensions. The later community image remains lazy-loaded until scrolled into view, as intended.
