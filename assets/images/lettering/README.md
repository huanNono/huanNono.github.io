# Homepage lettering

These four transparent PNGs were prepared with the built-in `image_gen` tool from the approved homepage reference images. They are the editable source assets; Hugo emits optimized WebP versions for the site.

- `huanNono.png`: the mixed-case name displayed below the avatar.
- `profile.png`: the face silhouette inside the P.
- `posts.png`: the turning page inside P and the pen nib in t.
- `works.png`: the aperture formed by the o.

`data/lettering.yaml` stores the SVG view boxes, which exclude transparent padding without changing the source pixels. `layouts/_partials/lettering.html` renders the artwork. The headings retain real text for accessibility.

## Extraction prompt

Each source used the same prompt: “Extract only the existing word from the approved website mockup. Preserve the original glyph contours, proportions, spacing, charcoal ink texture, and thematic details. Remove all website UI and background. Output exactly one intact word on a genuinely transparent background with a small transparent safety margin. Do not substitute a font or invent new details.”

Word-specific constraints:

- **huanNono**: preserve exact mixed case, the tall angular h, large capital N, wedge serifs, and final o terminal.
- **Profile**: preserve the side-profile silhouette cut into P and the long e terminal; the face and letter counters remain transparent.
- **Posts**: preserve the curved turning page and its shading inside P, and the nib at the bottom of t.
- **Works**: preserve the aperture opening and blade cuts, the tall W, and the long s terminal; the aperture cuts remain transparent.

Dark-mode lettering uses the user's reference white (`#FFFFFF`). Its CSS filter lifts the dark ink to white while retaining the page curl as a contrasting detail.
