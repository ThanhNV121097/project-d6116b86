/**
 * THE SITE'S MOTION, in one place. See level.ts for the three levels the
 * owner chooses between and what each adds.
 *
 *   <Motion />                      once, in the shell — every page then moves
 *   <SplitHeading k="…" as="h1" />  a heading whose words rise
 *   <Marquee>…</Marquee>            a band that runs by itself        (showpiece)
 *   <Pin heading={…}>…</Pin>        a section that holds while a row passes (showpiece)
 *   <Sequence images={[…]} />       pictures the scroll plays          (showpiece)
 *   <HeroVideo src poster />        a silent looping film, the owner's own
 *   <Stage3D src poster alt />      a 3D model turning under the pointer, the owner's own
 *
 * and by attribute, on any element:
 *
 *   data-parallax   a picture that drifts against the scroll
 *   data-zoom       a picture that grows as it passes        (showpiece)
 *   data-drift      a row or a word that slides with scroll  (showpiece)
 *   data-count      a number that counts up to itself
 *   data-magnetic   a button that leans towards the pointer
 *   data-tilt       a card that tilts under the pointer
 *   data-lens       a frame whose picture is looked into, at twice its size
 *   data-drag       a sideways row that can be dragged and thrown
 *   data-reveal     anything that is not a <section> but should arrive
 *
 * <Picture motion="parallax" /> puts the attribute on a picture for you;
 * <ProductGallery> already has the lens, and <ProductImage hover={…}> shows a
 * thing's second picture under the pointer.
 *
 * Every one of them is the finished page first: on a calmer site, on a phone,
 * for a visitor who asked for less motion, each stands still and whole.
 */
import { lazy } from "react";

export { default as Motion } from "./Motion";
export { default as SplitHeading } from "./SplitHeading";
export { default as Marquee } from "./Marquee";
export { chosenLevel, movement, type MotionLevel, type Movement } from "./level";
export { default as Pin } from "./Pin";
export { default as Sequence } from "./Sequence";
export { default as HeroVideo } from "./HeroVideo";
/** The 3D stage, loaded only by a page that shows one: three.js is large. */
export const Stage3D = lazy(() => import("./Model3D"));
