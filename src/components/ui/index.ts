/**
 * The single import path for every downstream implementer.
 *
 *   import { Section, Container, Button } from "@/components/ui";
 *
 * Nothing outside this directory should reach into an individual primitive's
 * file. Everything below is a shared contract from design/components.md S4 -
 * write it exactly, do not add props, do not rename, do not widen a union.
 */

export { ArticleCard, type ArticleCardProps, type BlogPost } from "./ArticleCard";
export { Button, type ButtonProps } from "./Button";
export { Card, type CardProps } from "./Card";
export { Container, type ContainerProps, type ContainerWidth } from "./Container";
export { Disclosure, type DisclosureProps } from "./Disclosure";
export {
  DisplayHeading,
  type DisplayHeadingProps,
} from "./DisplayHeading";
export { Grain, type GrainProps } from "./Grain";
export { Icon, type IconProps } from "./Icon";
export type { IconName, IconSize } from "./Icon/types";
export { Logo, type LogoProps } from "./Logo";
export { Media, type MediaProps } from "./Media";
export {
  PhoneMockup,
  type PhoneMockupProps,
  type PhoneScreen,
} from "./PhoneMockup";
export { Pill, type PillProps } from "./Pill";
export { Prose, type ProseProps } from "./Prose";
export { Reveal, type RevealProps } from "./Reveal";
export { SearchField, type SearchFieldProps } from "./SearchField";
export { Section, type SectionProps, type SectionRhythm } from "./Section";
export { SelectPill, type SelectPillProps } from "./SelectPill";
export { SkipLink, type SkipLinkProps } from "./SkipLink";
export { StretchedLink, type StretchedLinkProps } from "./StretchedLink";
export { VisuallyHidden, type VisuallyHiddenProps } from "./VisuallyHidden";
