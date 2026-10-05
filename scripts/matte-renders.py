"""
Lift the studio renders off their white sweep.

The hard part is that these are white cabinets photographed on white paper: the
body of the Ruba unit departs from pure white by about 18 levels, while its own
contact shadow reaches 28. No brightness threshold can tell them apart, so the
silhouette is found structurally -- from the gradient ring around the unit --
and everything outside it is un-multiplied against white, which turns the soft
shadow into partially transparent black rather than deleting it.

Kept here because the renders in `public/products/` were produced with it and
any future batch has to match them. Needs pillow, numpy and scipy:

    python scripts/matte-renders.py shot.jpg public/products/shot.webp
"""

import sys
import numpy as np
from PIL import Image
from scipy import ndimage


PEEL_REACH = 24  # px; deeper than any skirt, shallower than a countertop


def _peel_paper_skirt(filled, rgb):
    """Shave paper that the fill annexed along the silhouette's own outline.

    Closing a unit's outline into a ring also swallows the sliver of sweep
    trapped between the unit and the contact shadow it casts, which surfaces as
    a white skirt around the base. Those pixels are pure paper and they touch
    the outside, so they can be peeled inwards until the first pixel that is
    actually distinguishable from the sweep.

    The peel is capped in reach. Without the cap it would crawl along a
    blown-out countertop -- as pure as the paper, and meeting it without a
    visible edge -- and slit the basin open.
    """
    score = np.maximum(255.0 - rgb.max(2), rgb.max(2) - rgb.min(2))
    paper = score <= 2.0

    outside = ~filled
    reach = ndimage.binary_dilation(outside, np.ones((2 * PEEL_REACH + 1,) * 2))

    region = filled & paper & reach
    seed = region & ndimage.binary_dilation(outside, np.ones((3, 3)))
    return filled & ~ndimage.binary_propagation(seed, mask=region)


def silhouette(rgb):
    """Closed, filled outline of the object, ignoring the diffuse shadow."""
    grey = rgb.mean(2)

    # A soft shadow is smooth; an edge of cabinetry is not. The gradient is the
    # one signal that separates them here: across a 50px shadow ramp it sits
    # around 4, across a cabinet outline it runs into the hundreds.
    smooth = ndimage.gaussian_filter(grey, 1.0)
    gy = ndimage.sobel(smooth, axis=0)
    gx = ndimage.sobel(smooth, axis=1)
    grad = np.hypot(gx, gy)

    edges = grad >= 14.0

    # Anything with real colour or real darkness belongs to the object outright:
    # handles, veined stone, a graphite carcass.
    v = rgb.max(2)
    sat = rgb.max(2) - rgb.min(2)
    edges |= (sat >= 18) | (v <= 170)

    # Seal the outline into a continuous ring before filling, otherwise the fill
    # escapes through a soft corner and floods the frame.
    edges = ndimage.binary_closing(edges, np.ones((9, 9)))
    filled = ndimage.binary_fill_holes(edges)

    # The closing grew the silhouette by a few pixels, and those pixels are
    # sweep, not product.
    filled = ndimage.binary_erosion(filled, np.ones((7, 7)))
    filled = _peel_paper_skirt(filled, rgb)

    # Drop speckle: stray gradient from JPEG ringing out in the sweep.
    lab, n = ndimage.label(filled)
    if n:
        areas = ndimage.sum(filled, lab, range(1, n + 1))
        filled = np.isin(lab, 1 + np.flatnonzero(areas >= 0.0008 * filled.size))
    return filled


def cut(path_in, path_out, quality=88):
    rgb = np.asarray(Image.open(path_in).convert("RGB")).astype(np.float32)

    mask = silhouette(rgb)

    # Feather the silhouette over the render's own antialiasing band.
    core = ndimage.gaussian_filter(mask.astype(np.float32), 0.8)

    # Outside the object, the frame is "something over white", so the alpha that
    # reproduces it on any background is exactly its distance from white.
    unmult = (255.0 - rgb.max(2)) / 255.0

    alpha = np.maximum(core, unmult)
    alpha[alpha < 0.02] = 0.0
    alpha = np.clip(alpha, 0.0, 1.0)

    # Recover the colour that was blended with the sweep. Inside the object
    # alpha is 1 and this is the identity.
    a = alpha[..., None]
    with np.errstate(invalid="ignore", divide="ignore"):
        colour = np.where(a > 0, (rgb - 255.0 * (1.0 - a)) / np.maximum(a, 1e-6), 0.0)
    colour = np.clip(colour, 0, 255)

    out = np.dstack([colour, alpha * 255.0]).round().astype(np.uint8)
    Image.fromarray(out, "RGBA").save(path_out, "WEBP", quality=quality, method=6)

    return float(alpha.mean()), float((alpha > 0).mean())


if __name__ == "__main__":
    src, dst = sys.argv[1], sys.argv[2]
    mean_a, cover = cut(src, dst)
    print(f"{dst}  mean alpha {mean_a:.3f}  covered {cover:.3f}")
