import type { Metadata } from "next";

import { HelpSupport } from "@/components/sections/HelpSupport";
import {
  HELP_HUB_HEADING,
  HELP_HUB_STANDFIRST,
  HELP_TOPICS,
} from "@/content/help";

/** Both strings are the hub's own nodes - `500:1768` and `500:1769`. */
export const metadata: Metadata = {
  title: HELP_HUB_HEADING,
  description: HELP_HUB_STANDFIRST,
};

/**
 * `/help` - Figma `498:209` (closed) and `500:2281` (opened).
 *
 * ONE ROUTE, NOT TWO. The two frames are the same page in two states: the
 * sidebar, the nav and the footer are byte-identical across both, and only the
 * right-hand column swaps between the resource hub and an opened article
 * (D-001). `HelpSupport` holds that state internally, so this route mounts it
 * once and passes no `article`.
 *
 * `article` is the INITIAL state, not a mode. Passing it here would land a
 * reader on the opened article with no way to have asked for it, and the
 * closed frame is the one the design draws as the page's resting state. The
 * open state is reached the way the design implies - by choosing a hub card or
 * a sidebar topic.
 *
 * The `<h1>` ("Help & Support", `500:1768`) lives inside `HelpSupport`, which
 * also owns the `<section>` landmark, so nothing wraps it here.
 *
 * NOT BUILT, DELIBERATELY: `498:402`, a stray "View More" pill sitting at
 * y 2954 on the closed frame - roughly 1100px below the footer's own bottom
 * edge (footer at y 1094, height 764). It is orphaned canvas debris from the
 * blog layout, is not visible in the rendered frame, and has no counterpart on
 * `500:2281`. Recorded as a finding rather than reproduced.
 */
export default function HelpPage() {
  return <HelpSupport topics={HELP_TOPICS} />;
}
