"use client";

import { useEffect, useRef, useState } from "react";

import kenyaFlag from "@design-system/assets/illustration/cta-flag-kenya.png";
import nigeriaFlag from "@design-system/assets/illustration/cta-flag-nigeria.png";

/**
 * `CtaCoins` - the `412:1234` coin cluster, rebuilt as layers so it can
 * perform the operator's landing choreography (authored 2026-09-04; the
 * keyframes live in theme.css, "CTA COINS CHOREOGRAPHY").
 *
 * THIS SUPERSEDES HALF OF THE assets.md S4.3 FLATTENING DECISION - KNOWINGLY.
 * ---------------------------------------------------------------------------
 * S4.3 chose "one flattened SVG... Not a layered set" for four reasons, and
 * the heaviest was #1: "the file contains no authored motion at all...
 * Nothing is going to move them." That premise is the one thing that changed:
 * the operator has now authored motion, and per-layer delivery exists for
 * exactly this consumer. The flat file stays in the design system as the
 * static record; this component is its layered derivation, geometry verbatim.
 *
 * Reason #2 - the hard-light flag faces blend against what is beneath them,
 * and splitting them across siblings would blend them against the page - is
 * honoured rather than overturned: each flag stays INSIDE its coin's group,
 * and because an animated group is its own stacking context, the flag blends
 * against its own disc face and nothing else. That is the pairing the design
 * composed (each flag ellipse is coincident with its disc to within 0.4 user
 * units), it no longer varies with whatever happens to be behind the coin,
 * and the root group keeps `isolation: isolate` so the page can never leak
 * into any of it. The two flag rasters move from base64 payloads to files
 * (`cta-flag-kenya.png`, `cta-flag-nigeria.png`) so the inline markup ships
 * ~4KB of vector rather than ~48KB of the same bytes uncacheable.
 *
 * WHAT MOVED IN THE PAINT ORDER, AND WHY IT IS INVISIBLE AT REST. The flat
 * file paints Kenya, ghosts, AZZA, Nigeria, wordmark, then both flags on top
 * of everything. Nothing overlaps at rest, so that order was never observable
 * - but it becomes observable the moment coins cross, so the layers here are
 * ordered for the choreography: pads, then Kenya, then Nigeria (it lands ON
 * Kenya), then AZZA (everything ends beneath it) - each coin carrying its own
 * wall, face and flag.
 *
 * THE TRIGGER. Play when 60% of the art is in view; reset only when it has
 * fully left. The gap between those two thresholds is deliberate hysteresis:
 * a visitor idling at the fold cannot make it stutter, and mid-play partial
 * scrolls change nothing. Resetting offscreen is what makes the piece
 * re-performable - the finale leaves a lone AZZA coin, and without the reset
 * every later visit to the section would open on that emptied stage.
 * `Reveal`'s geometric fallback is NOT copied here, on its own logic: it
 * exists because a missed observer event would leave CONTENT invisible
 * forever, and this art's unanimated state is the complete composition. A
 * missed event here costs one performance, not pixels.
 *
 * REDUCED MOTION plays nothing: the whole choreography block in theme.css is
 * gated on `no-preference`, so this attribute becomes inert and the art holds
 * the composition the design draws. Same for no-JS, where the attribute is
 * never set at all.
 */
export function CtaCoins() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= 0.6) setPlaying(true);
          else if (!entry.isIntersecting) setPlaying(false);
        }
      },
      { threshold: [0, 0.6] },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-figma-node="412:1234"
      data-cta-coins={playing ? "play" : undefined}
      className="pointer-events-none mt-4 w-full max-w-[1069px]"
    >
      <svg
        viewBox="0 0 1070 616"
        fill="none"
        role="presentation"
        aria-hidden="true"
        className="block h-auto w-full"
      >
        <g style={{ isolation: "isolate" }}>
          {/* The three ghost pads - 412:1240 (top-left), 412:1239
           * (bottom-right), 412:1241 (under the Nigeria coin). Painted first:
           * everything lands on top of them. Each fades the moment the
           * choreography retires it. */}
          <circle className="cta-pad-tl" cx="128.3" cy="128.3" r="128.3" transform="matrix(0.857493 -0.514496 0.830139 0.557556 14.2246 220.654)" fill="#F1F1F1" />
          <circle className="cta-pad-br" cx="128.3" cy="128.3" r="128.3" transform="matrix(0.857493 -0.514496 0.830139 0.557556 582.149 430.752)" fill="#F1F1F1" />
          <circle className="cta-pad-ngn" cx="128.3" cy="128.3" r="128.3" transform="matrix(0.857493 -0.514496 0.830139 0.557556 17.5059 472.334)" fill="#F2F2F2" />

          {/* Kenya coin - wall 412:1237, face 412:1238, flag 412:1257. */}
          <g className="cta-coin-kenya">
            <path d="M957.257 127.626C972.963 139.405 989.151 134.922 995.137 147.689C995.137 159.154 994.868 184.22 993.964 193.55C991.725 216.657 974.172 237.606 939.784 250.597C873.145 275.772 772.927 261.531 715.939 218.79C688.595 198.282 678.675 176.352 678.008 153.422C678.008 146.621 678.006 130.492 678.006 116.16C686.036 100.325 708.148 105.363 733.412 95.8186C800.05 70.6442 900.269 84.8846 957.257 127.626Z" fill="#FE0000" fillOpacity="0.15" />
            <circle cx="128.982" cy="128.982" r="128.982" transform="matrix(0.935472 -0.353401 0.8 0.6 612.75 91.1641)" fill="#FDD518" />
            <g style={{ mixBlendMode: "hard-light" }}>
              <circle cx="129.088" cy="129.088" r="129.088" transform="matrix(0.935472 -0.353401 0.8 0.6 612.897 91.3691)" fill="url(#cta-flag-kenya)" />
            </g>
          </g>

          {/* Nigeria coin - wall 412:1249, face 412:1250, flag 412:1256.
           * Painted above Kenya: step 2 lands it on that coin. */}
          <g className="cta-coin-ngn">
            <path d="M349.94 446.126C365.646 457.905 381.833 453.422 387.819 466.189C387.819 477.654 387.551 502.72 386.647 512.05C384.408 535.157 366.854 556.106 332.466 569.097C265.828 594.272 165.609 580.031 108.621 537.29C81.2775 516.782 71.3573 494.852 70.691 471.922C70.691 465.121 70.6885 448.992 70.6885 434.66C78.7182 418.825 100.83 423.863 126.095 414.319C192.733 389.144 292.952 403.385 349.94 446.126Z" fill="#A9DEC9" />
            <circle cx="128.982" cy="128.982" r="128.982" transform="matrix(0.935472 -0.353401 0.8 0.6 5.43213 407.477)" fill="#05955C" />
            <g style={{ mixBlendMode: "hard-light" }}>
              <ellipse cx="128.875" cy="129.676" rx="128.875" ry="129.676" transform="matrix(0.935472 -0.353401 0.8 0.6 5.47217 407.064)" fill="url(#cta-flag-nigeria)" />
            </g>
          </g>

          {/* AZZA coin - walls 412:1244/1245/1246, face 412:1247, wordmark
           * 412:1251. Painted last: the stack's final move slides beneath it. */}
          <g className="cta-coin-azza">
            <path d="M615.848 294.038C631.554 305.817 647.742 301.334 653.727 314.101C653.727 325.566 653.459 350.632 652.555 359.962C650.316 383.069 632.763 404.018 598.374 417.009C531.736 442.184 431.517 427.943 374.53 385.202C347.186 364.694 337.266 342.764 336.599 319.834C336.599 313.033 336.597 296.904 336.597 282.572C344.626 266.737 366.739 271.775 392.003 262.231C458.641 237.056 558.86 251.297 615.848 294.038Z" fill="#F4F4F4" />
            <path d="M616.942 262.862C632.648 274.641 648.835 270.159 654.821 282.926C654.821 294.391 654.553 319.456 653.649 328.786C651.41 351.893 633.856 372.842 599.468 385.833C532.83 411.008 432.611 396.767 375.623 354.027C348.279 333.519 338.359 311.588 337.693 288.658C337.693 281.857 337.69 265.728 337.69 251.397C345.72 235.562 367.832 240.599 393.097 231.055C459.735 205.881 559.954 220.121 616.942 262.862Z" fill="#ACABEB" />
            <path d="M617.241 223.419C632.947 235.198 649.135 230.715 655.121 243.482C655.121 254.947 654.853 280.013 653.948 289.343C651.709 312.45 634.156 333.399 599.768 346.39C533.13 371.565 432.911 357.324 375.923 314.583C348.579 294.075 338.659 272.145 337.993 249.215C337.993 242.414 337.99 226.285 337.99 211.953C346.02 196.118 368.132 201.156 393.397 191.612C460.035 166.437 560.254 180.678 617.241 223.419Z" fill="#504FB2" />
            <circle cx="128.982" cy="128.982" r="128.982" transform="matrix(0.935472 -0.353401 0.8 0.6 272.734 189.293)" fill="#15139B" />
            <path d="M530.495 220.294L543.004 238.412L553.101 236.129L530.495 220.294ZM570.834 248.233L566.032 244.772L549.371 248.539L552.154 252.455L526.621 258.285L504.788 221.617L548.797 211.668L596.414 242.45L570.834 248.233Z" fill="#FAFAFF" />
            <path d="M454.793 251.102L489.756 237.904L451.218 246.616L440.465 236.157L489.942 224.972L509.48 243.976L475.778 256.888L514.738 248.081L525.491 258.54L474.33 270.105L454.793 251.102Z" fill="#FAFAFF" />
            <path d="M482.327 197.164L517.29 183.967L478.752 192.679L467.999 182.22L517.476 171.035L537.014 190.038L503.313 202.951L542.272 194.144L553.025 204.602L501.865 216.168L482.327 197.164Z" fill="#FAFAFF" />
            <path d="M434.694 194.243L447.203 212.361L457.3 210.078L434.694 194.243ZM475.033 222.182L470.231 218.721L453.57 222.488L456.353 226.405L430.821 232.234L408.988 195.566L452.996 185.618L500.613 216.399L475.033 222.182Z" fill="#FAFAFF" />

            {/* The glimmer - a soft gloss band that sweeps the face once,
             * right as the button-press releases at the end of the
             * choreography. Clipped to the face disc; the rotation wrapper
             * exists because the sweep is a CSS transform on the rect, and a
             * CSS transform REPLACES an SVG transform attribute on the same
             * element - the angle would be lost if both lived on the rect.
             * Resting opacity is 0 (theme.css, ungated) so it is invisible
             * whenever the choreography is not running - including reduced
             * motion and no-JS. */}
            <g clipPath="url(#cta-azza-face)">
              <g transform="rotate(-25 496.58 221.1)">
                <rect
                  className="cta-azza-glimmer"
                  x="426.6"
                  y="11.1"
                  width="140"
                  height="420"
                  fill="url(#cta-glimmer)"
                />
              </g>
            </g>
          </g>
        </g>
        <defs>
          <clipPath id="cta-azza-face">
            <circle
              cx="128.982"
              cy="128.982"
              r="128.982"
              transform="matrix(0.935472 -0.353401 0.8 0.6 272.734 189.293)"
            />
          </clipPath>
          <linearGradient id="cta-glimmer" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="0.35" stopColor="#FFFFFF" stopOpacity="0.26" />
            <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="0.65" stopColor="#FFFFFF" stopOpacity="0.26" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <pattern
            id="cta-flag-nigeria"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use
              href="#cta-flag-nigeria-png"
              transform="matrix(0.00209629 0 0 0.00208333 -0.506218 0)"
            />
          </pattern>
          <pattern
            id="cta-flag-kenya"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use
              href="#cta-flag-kenya-png"
              transform="translate(-0.249415) scale(0.00117096)"
            />
          </pattern>
          <image
            id="cta-flag-nigeria-png"
            width="960"
            height="480"
            preserveAspectRatio="none"
            href={nigeriaFlag.src}
          />
          <image
            id="cta-flag-kenya-png"
            width="1280"
            height="854"
            preserveAspectRatio="none"
            href={kenyaFlag.src}
          />
        </defs>
      </svg>
    </div>
  );
}
