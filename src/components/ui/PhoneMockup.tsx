import Image from "next/image";

import deviceFrame from "@design-system/assets/product/device-frame-phone.webp";
import deviceShadow from "@design-system/assets/product/device-frame-phone-shadow.webp";
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
const SCREEN_RADIUS = "12.59%"; // of the screen width

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
 * THE QUARANTINE (DECISIONS D-019). `phone-screen-whatsapp-business.webp`
 * contains a legible real Nigerian account number, account name and bank name.
 * It is NOT in the repository and is .gitignore'd by filename. So:
 *
 *   - `screen` defaults to "redacted", which renders a flat surface.placeholder
 *     panel at the screen geometry. The panel is `aria-hidden`: it is
 *     decorative, and the build status behind it is not page content. It ships
 *     without the asset.
 *   - `screen="whatsapp-business"` must not be passed by any Phase 2 agent. It
 *     exists so that dropping a scrubbed screenshot at
 *     design-system/assets/product/phone-screen-whatsapp-business.webp and
 *     changing one prop is the entire fix. Until that file exists it renders
 *     the redacted panel, because a static import of a missing file would break
 *     the build for everyone.
 *   - `screen="whatsapp-transfer"` is the real, safe asset and serves all four
 *     other mockups (507:764, 570:465, 553:298, 553:304 - one file, md5-verified).
 */
export function PhoneMockup({
  screen = "redacted",
  width,
  rasterShadow = false,
  screenAlt,
  priority = false,
  className,
}: PhoneMockupProps) {
  const showTransfer = screen === "whatsapp-transfer";

  return (
    <div
      className={cn("relative", className)}
      style={{ width: `${width}px`, maxWidth: "100%" }}
    >
      <div
        className="relative w-full"
        style={{ aspectRatio: DEVICE_ASPECT }}
      >
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
          {showTransfer ? (
            <Image
              src={whatsappTransfer}
              alt={screenAlt ?? ""}
              fill
              priority={priority}
              loading={priority ? undefined : "lazy"}
              sizes="(max-width:767px) 70vw, 363px"
              className="object-cover object-[center_42%]"
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
            <div
              aria-hidden="true"
              className="h-full w-full bg-surface-placeholder"
            />
          )}
        </div>
      </div>
    </div>
  );
}
