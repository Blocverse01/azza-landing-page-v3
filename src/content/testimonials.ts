import type { StaticImageData } from "next/image";

import avatar0xdave from "@design-system/assets/testimonials/avatar-0xdave.png";
import avatar0xunahh from "@design-system/assets/testimonials/avatar-0xunahh.png";
import avatarAushoj from "@design-system/assets/testimonials/avatar-aushoj.png";
import avatarChiefDaddyGhost from "@design-system/assets/testimonials/avatar-chiefdaddyghost.png";
import avatarJamesAdedokun from "@design-system/assets/testimonials/avatar-jamesadedokun.png";
import avatarJudicodes from "@design-system/assets/testimonials/avatar-judicodes.png";
import avatarMissPurrple from "@design-system/assets/testimonials/avatar-misspurrple.png";
import avatarMsLinda from "@design-system/assets/testimonials/avatar-mslinda.png";
import avatarSuperteamEarn from "@design-system/assets/testimonials/avatar-superteamearn.png";
import avatarTemioflagos from "@design-system/assets/testimonials/avatar-temioflagos.png";
import avatarVicwritesall from "@design-system/assets/testimonials/avatar-vicwritesall.png";
import avatarYagazieweb from "@design-system/assets/testimonials/avatar-yagazieweb.png";

/**
 * The testimonial tweets - Figma `861:312` ("What People Say", 2026-09 operator
 * revision of 412:1065), one record per drawn card, in the drawn stack order.
 *
 * Every string is TRANSCRIBED VERBATIM from the design - typographic
 * apostrophes, doubled spaces ("Ghana  for"), the trailing space in
 * "Superteam Earn ", emoji, and the trailing ellipses where the design
 * truncates a longer tweet. These are real posts by real accounts; rewording
 * them here would misquote a person.
 *
 * `body` is a list of segments rather than a string because the design colours
 * @-mentions X-link-blue mid-sentence. Card 861:621 (Superteam Earn) is the one
 * card whose "@useazza" the design does NOT colour - so the mention flag is
 * data, not something a renderer may infer from a leading "@".
 *
 * `verified` mirrors which drawn cards carry the badge (8 of 12 do).
 */

export interface TweetSegment {
  text: string;
  /** Renders in X's link blue. Only ever set on an @-handle. */
  mention?: true;
}

export interface Tweet {
  /** The card's Figma node, for tracing a record back to the drawing. */
  node: string;
  name: string;
  handle: string;
  verified: boolean;
  avatar: StaticImageData;
  /** `\n` inside a segment is a drawn line break (rendered pre-line). */
  body: readonly TweetSegment[];
  time: string;
  date: string;
  views: string;
}

export const TESTIMONIAL_TWEETS: readonly Tweet[] = [
  {
    node: "861:637",
    name: "nwankwo.eth (🧱, 🥑)",
    handle: "@judicodes",
    verified: true,
    avatar: avatarJudicodes,
    // The drawn card carries two empty zero-width-space lines after the text;
    // they exist to give the shortest tweet a card worth of height and are
    // reproduced as authored.
    body: [
      { text: "I paid for my " },
      { text: "@EFDevcon", mention: true },
      { text: " ticket using " },
      { text: "@useazza", mention: true },
      { text: "\n​\n​" },
    ],
    time: "11:09 PM",
    date: "Aug 18, 2025",
    views: "2,565",
  },
  {
    node: "861:516",
    name: "Achalugo",
    handle: "@_MsLinda",
    verified: true,
    avatar: avatarMsLinda,
    body: [
      { text: "Tried " },
      { text: "@useazza", mention: true },
      {
        text: " and it’s so good. So fast too. And the rates are exactly market rates. \nWell done...",
      },
    ],
    time: "4:07 PM",
    date: "Sep 10, 2025",
    views: "10.2K",
  },
  {
    node: "861:585",
    name: "JoshDairo ⛓",
    handle: "@aushoj",
    verified: true,
    avatar: avatarAushoj,
    body: [
      {
        text: "Ever since I got to know Azza, I have been using it and it never ceases to amaze me how trading crypto can be as easy as just texting a bot",
      },
    ],
    time: "12:04 PM",
    date: "Aug 21, 2025",
    views: "365",
  },
  {
    node: "861:533",
    name: "0xDave",
    handle: "@0xDave0",
    verified: true,
    avatar: avatar0xdave,
    body: [
      { text: "I just discovered " },
      { text: "@useazza", mention: true },
      {
        text: " — the AI crypto agent that brings instant cashouts to WhatsApp.\nIt’s fast, secure, and honestly feels different...",
      },
    ],
    time: "1:11 PM",
    date: "Aug 28, 2025",
    views: "693",
  },
  {
    node: "861:655",
    name: "James Adedokun 🌲",
    handle: "@JamesAdedokun9",
    verified: false,
    avatar: avatarJamesAdedokun,
    body: [
      { text: "Just used " },
      { text: "@useazza", mention: true },
      {
        text: " to complete a trade which was problematic on a CEX.\nThis platform and interface is easy to use tbh...",
      },
    ],
    time: "9:01 PM",
    date: "Aug 14, 2025",
    views: "2,475",
  },
  {
    node: "861:480",
    name: "VictoWrite",
    handle: "@vicwritesall",
    verified: true,
    avatar: avatarVicwritesall,
    body: [
      { text: "My trip to Ghana  for the concluded " },
      { text: "@ETHAccra", mention: true },
      { text: "\n\nAll my life expense was paid using " },
      { text: "@useazza", mention: true },
      { text: "..." },
    ],
    time: "12:34 PM",
    date: "Sep 10, 2025",
    views: "888",
  },
  {
    node: "861:603",
    name: "Temionchain",
    handle: "@_temioflagos",
    verified: true,
    avatar: avatarTemioflagos,
    body: [
      {
        text: "Thank you Sapien, let’s do more 🤲🏻\nGot a little stimmy and converted swiftly with ",
      },
      { text: "@useazza", mention: true },
      { text: " my surest off-ramp plug on WhatsApp" },
    ],
    time: "10:30 AM",
    date: "Aug 21, 2025",
    views: "852",
  },
  {
    node: "861:551",
    name: "unahh evm/acc",
    handle: "@0xunahh",
    verified: true,
    avatar: avatar0xunahh,
    body: [
      {
        text: "saw a guy trying to off-ramp and pay for food at the eatery today, decided to put him on how to use ",
      },
      { text: "@useazza", mention: true },
      { text: " and ended up paying for his food and..." },
    ],
    time: "9:46 AM",
    date: "Aug 27, 2025",
    views: "3,666",
  },
  {
    node: "861:671",
    name: "CDGhost",
    handle: "@ChiefDaddyGhost",
    verified: false,
    avatar: avatarChiefDaddyGhost,
    body: [
      { text: "Bybit is finally dead, I just used " },
      { text: "@useazza", mention: true },
      {
        text: " to withdraw my urgent 2k (literally).\nNo stress, just setup your account on the WhatsApp... ",
      },
    ],
    time: "1:32 PM",
    date: "Aug 14, 2025",
    views: "740",
  },
  {
    node: "861:498",
    name: "Miss Purple 💜",
    handle: "@MissPurrple_",
    verified: true,
    avatar: avatarMissPurrple,
    body: [
      {
        text: "My last night in Lagos. Ended it with dinner at the Bodega, made possible by ",
      },
      { text: "@useazza", mention: true },
      { text: ", my GORGEOUS friends, and the City of Lagos..." },
    ],
    time: "11:13 PM",
    date: "Aug 31, 2025",
    views: "5,952",
  },
  {
    node: "861:621",
    name: "Superteam Earn ",
    handle: "@SuperteamEarn",
    verified: false,
    avatar: avatarSuperteamEarn,
    // The one card whose "@useazza" the design leaves white - no mention flag.
    body: [
      {
        text: "What if using crypto were as easy as texting?\nWell, it is with @useazza, a smart trading bot that runs on WhatsApp. You can easily on-ramp or off...",
      },
    ],
    time: "8:53 AM",
    date: "Aug 20, 2025",
    views: "4,616",
  },
  {
    node: "861:569",
    name: "Yagazie || Designer 🖱",
    handle: "@yagazieweb",
    verified: false,
    avatar: avatarYagazieweb,
    body: [
      {
        text: "I think right now nothing beats AZZA how th!! Can you swap your Crypto to naira like you're texting your friend so so easy broo!!",
      },
    ],
    time: "11:37 AM",
    date: "Aug 21, 2025",
    views: "402",
  },
];

/**
 * The cycling words on the blue panel, in cycle order. "FAST" is the drawn
 * static state (861:475) and therefore both the first frame of the cycle and
 * the resting frame under prefers-reduced-motion.
 */
export const SUPER_WORDS = ["Fast", "Smooth", "Easy"] as const;
