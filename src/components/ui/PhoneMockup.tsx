import Image from "next/image";

import deviceFrame from "@design-system/assets/product/device-frame-phone.webp";
import deviceShadow from "@design-system/assets/product/device-frame-phone-shadow.webp";
import whatsappBusiness from "@design-system/assets/product/phone-screen-whatsapp-business.webp";
import whatsappTransfer from "@design-system/assets/product/phone-screen-whatsapp-transfer.webp";
import { cn } from "@/lib/cn";

export type PhoneScreen = "whatsapp-transfer" | "whatsapp-business" | "redacted";

/*
 * Geometry - measured off 507:761 (components.md S4.8). Use verbatim.
 *
 * The device body and its drop shadow are raster image fills, not CSS shapes.
 * Do not try to draw the handset with `border-radius` and a border; the frame
 * has a moulded bezel, a notch and a specular edge that a rounded rect cannot
 * reproduce.
 */
const DEVICE_ASPECT = "1002/2048";
const SCREEN_LEFT = "4.99%";
const SCREEN_TOP = "1.86%";
const SCREEN_WIDTH = "90.6%";
const SCREEN_HEIGHT = "96.1%";
/*
 * The Figma corner is CIRCULAR: 12.59% of the SCREEN WIDTH on both axes.
 * A bare `border-radius: 12.59%` is NOT that - a single percentage resolves
 * per axis (width horizontally, height vertically), and this screen is ~2.17x
 * taller than wide, so every corner rendered as a tall ellipse: the screenshot
 * peeled away from the bezel in a long vertical sweep on all four mockups
 * site-wide. The slash syntax pins both radii to the same physical length:
 * the vertical share is 12.59% x (907.812 / 1968.128 intrinsic screen box)
 * = 5.807% of the height.
 */
const SCREEN_RADIUS = "12.59% / 5.807%";

export interface PhoneMockupProps {
  /**
   * Which screenshot sits inside the device.
   * DEFAULT IS "redacted" - see the quarantine note below.
   */
  screen?: PhoneScreen;
  /** Rendered device width in px. The frame is 1002x2048 intrinsic; height follows. */
  width: number;
  /**
   * Render the separate 70%-opacity raster shadow layer. When false, a CSS
   * drop-shadow is used. Prefer false; ship true only if the CSS does not match
   * at 1440.
   */
  rasterShadow?: boolean;
  /** Alt text for the screen. Required when screen !== "redacted". */
  screenAlt?: string;
  priority?: boolean;
  className?: string;
}

/**
 * The phone mockup.
 *
 * THE QUARANTINE, RESOLVED (DECISIONS D-019, closed by D-060 on 2026-08-22).
 * The business chat screenshot originally carried a legible real account
 * number, account name and bank name, so the file was .gitignore'd and this
 * component shipped a redacted panel in its place. The committed
 * `phone-screen-whatsapp-business.webp` is now a SCRUBBED export of the
 * operator's revised design (800:424): the bottom 25% of the bitmap - the
 * region carrying the three account-detail rows, which sits entirely below the
 * crop `WhyAzzaSteps` renders - is painted over with the chat wallpaper
 * colour. Nothing visible changed; the sensitive rows no longer exist in the
 * shipped bytes. If this asset is ever re-exported from Figma, scrub it the
 * same way BEFORE committing - the source frame still contains the real rows.
 *
 *   - `screen` still defaults to "redacted" (a flat surface.placeholder panel,
 *     `aria-hidden`), so no consumer shows a chat screen it did not ask for.
 *   - `screen="whatsapp-business"` renders the scrubbed business-onboarding
 *     chat. Its one consumer, `WhyAzzaSteps` (800:421), was retired on
 *     2026-09-07; the screen stays available for the next design that draws it.
 *   - `screen="whatsapp-transfer"` serves all four other mockups
 *     (507:764, 570:465, 553:298, 553:304 - one file, md5-verified).
 */
export function PhoneMockup({
  screen = "redacted",
  width,
  rasterShadow = false,
  screenAlt,
  priority = false,
  className,
}: PhoneMockupProps) {
  const screenSrc =
    screen === "whatsapp-transfer"
      ? whatsappTransfer
      : screen === "whatsapp-business"
        ? whatsappBusiness
        : null;

  return (
    <div className={cn("relative", className)} style={{ width: `${width}px`, maxWidth: "100%" }}>
      <div className="relative w-full" style={{ aspectRatio: DEVICE_ASPECT }}>
        {rasterShadow ? (
          <Image
            src={deviceShadow}
            alt=""
            aria-hidden="true"
            fill
            sizes={`${width}px`}
            className="object-contain opacity-70"
          />
        ) : null}

        {/*
          Figma child order in `507:761` and `570:462` is shadow -> body -> screen,
          so the device body paints BEFORE the screen, not after it.

          The original order here put the frame last, on top of the screen. That
          looks harmless - a bezel overlapping the screen edges is the normal way
          to build a mockup - and it typecheck/lint/build clean. But
          `device-frame-phone.webp` carries alpha only for its rounded outer
          corners; the screen aperture itself is filled opaque black. Verified two
          ways: the file has a VP8X alpha flag and an ALPH chunk (so it is not a
          flat opaque image), while three independent agents sampling the composite
          got (0,0,0,255) at the screen centre, 25% and 75%.

          Net effect: every screenshot loaded fine and was then completely covered,
          on all four consumers site-wide. Painting the body first lets the frame's
          real transparency do the bezel work and leaves the screen visible.
        */}
        <Image
          src={deviceFrame}
          alt=""
          aria-hidden="true"
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes={`${width}px`}
          className={cn(
            "pointer-events-none object-contain",
            rasterShadow ? undefined : "drop-shadow-xl",
          )}
        />

        <div
          className="pointer-events-none absolute overflow-hidden"
          style={{
            left: SCREEN_LEFT,
            top: SCREEN_TOP,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            borderRadius: SCREEN_RADIUS,
          }}
        >
          {screenSrc ? (
            <Image
              src={screenSrc}
              alt={screenAlt ?? ""}
              fill
              priority={priority}
              loading={priority ? undefined : "lazy"}
              sizes="(max-width:767px) 70vw, 421px"
              className={cn(
                "object-cover",
                // The 42% crop centre is the transfer screenshot's own framing
                // (507:764); the business screen (800:424) sits at the design's
                // near-top placement, which plain `cover` reproduces.
                screen === "whatsapp-transfer" && "object-[center_42%]",
              )}
            />
          ) : (
            /*
             * The redacted panel is decorative and says nothing to a reader.
             * It used to carry a visually-hidden "Screenshot pending -
             * placeholder" note, which put internal build status into the
             * product narrative: on /products/for-business a screen-reader
             * user heard it mid-section, between two real sentences. Build
             * state is not page content. The panel is `aria-hidden` instead,
             * which matches the device frame and its shadow - every other
             * layer of this mockup is already hidden from AT - and leaves the
             * section reading exactly as it does for a sighted user, who is
             * likewise told nothing about a pending screenshot.
             */
            <div aria-hidden="true" className="bg-surface-placeholder h-full w-full" />
          )}
        </div>
      </div>
    </div>
  );
}
