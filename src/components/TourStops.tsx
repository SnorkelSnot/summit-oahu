"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * The Journey — interactive island map itinerary.
 *
 * A stylized O'ahu (traced from the Summit brochure map) sits sticky on
 * the left while the stop cards scroll on the right. As each card enters
 * view, the gold route draws itself further around the island and the
 * van marker drives along the road to the matching stop — longer drives
 * take longer, so the windward leg feels like a cruise, not a teleport.
 * Tapping any stop on the map jumps to its card. On mobile the map leads
 * the section, then miniaturizes into a floating picture-in-picture at
 * the bottom-right corner while the stops scroll.
 */

type Stop = {
  name: string;
  description: string;
  image: string;
  image2?: string; // optional second image — rendered as a side-by-side pair
  image2Alt?: string;
  coord: [number, number]; // position on the island map (SVG viewBox units)
  cruise?: boolean; // scenic drives woven into the route — not numbered stops
};

const stops: Stop[] = [
  {
    name: "Diamond Head Crater & Lookout",
    description:
      "Your journey begins in style with a cruise right into Le‘ahi — Diamond Head Crater itself. We pass through the historic tunnel bored into the crater wall and emerge inside a 300,000-year-old volcanic tuff cone, once a key military lookout guarding the island. On the way out, we pause at the lookout near the tunnel’s high point for sweeping views over the southeast shoreline — a perfect first taste of what the day holds.",
    image: "/images/stop-diamondhead.jpg",
    coord: [790, 747],
  },
  {
    name: "Halona Blowhole & Eternity Beach",
    description:
      "Two natural wonders share one dramatic stretch of lava coastline. The Halona Blowhole — formed thousands of years ago by molten lava tubes reaching the sea — funnels incoming swells through a submerged lava shelf and launches geysers of seawater high into the air; the bigger the surf, the bigger the show. From the same lookout, gaze down on Halona Cove, better known as Eternity Beach, where the famous surf-side embrace in the 1953 classic “From Here to Eternity” was filmed. It’s one of O‘ahu’s most photogenic views — and most visitors drive right past it.",
    image: "/images/stop-halona-blowhole.jpg",
    image2: "/images/stop-eternity-beach.jpg",
    image2Alt: "Eternity Beach (Halona Cove) from the lookout above",
    coord: [975, 730],
  },
  {
    name: "Makapu‘u Lookout",
    description:
      "Perched above the easternmost point of O‘ahu, the Makapu‘u Lookout delivers breathtaking views of turquoise water, windward sea cliffs, and the offshore seabird sanctuaries of Mānana (Rabbit Island) and Kāohikāipu. In winter months, keep your eyes on the channel — humpback whales cruise these waters and often put on a show. On clear days you can see all the way up the windward coastline you’re about to explore.",
    image: "/images/stop-makapuu.jpg",
    coord: [1022, 668],
  },
  {
    name: "Local Gift Shop in Waimanalo",
    description:
      "A favorite little stop in the heart of Waimanalo — country O‘ahu at its most charming. Browse locally made gifts, crafts, and island treats you won’t find in the Waikiki ABC Stores, and take home a souvenir with a real story behind it. Supporting small local businesses is part of how we tour — and this one is a gem.",
    image: "/images/stop-waimanalo.jpg",
    coord: [920, 590],
  },
  {
    name: "Leonard’s Malasadas",
    description:
      "A Hawai‘i must. Sink your teeth into hot, fresh-from-the-fryer Portuguese doughnuts — crispy on the outside, pillowy on the inside, and rolled in sugar while still warm. Brought to the islands by Portuguese plantation workers and perfected by Leonard’s Bakery since 1952, the malasada is a beloved piece of local food culture. Try the classic, or go for one filled with haupia (coconut cream) if you’re feeling adventurous (malasadas not included in tour price).",
    image: "/images/stop-leonards01.jpg",
    coord: [855, 522],
  },
  {
    name: "Byodo-In Temple",
    description:
      "Nestled at the foot of the emerald Ko‘olau cliffs in the Valley of the Temples, the Byodo-In is a stunning replica of a 950-year-old Buddhist temple in Uji, Japan. Ring the three-ton sacred bell for good fortune, wander the koi ponds and meditation gardens, and watch black swans glide beneath the misty pali. It’s one of the most peaceful — and most photographed — places on the island.",
    image: "/images/stop-byodoin.jpg",
    coord: [785, 455],
  },
  {
    name: "Cruise the Windward Side",
    cruise: true,
    description:
      "This is the O‘ahu that takes people’s breath away. As we cruise the windward coast, the fluted cliffs of the Ko‘olau range tower thousands of feet above the road — the eroded remains of a massive shield volcano, carved by a million years of wind, rain, and epic volcanic forces. Around every bend: dramatic pali, offshore islets rising from turquoise bays, sleepy fishing villages, and postcard ocean views the entire way. Cameras ready — this stretch is pure magic.",
    image: "/images/stop-windward.jpg",
    coord: [735, 370],
  },
  {
    name: "Lunch at Tanaka Kahuku Shrimp",
    description:
      "Arguably the best shrimp on the island. The aquaculture farms of Kahuku made the North Shore shrimp truck famous, and Tanaka is where locals send their friends. Savor plump, locally raised garlic shrimp sizzled in butter and served with rice — simple, messy, unforgettable (lunch not included in tour price).",
    image: "/images/stop-tanaka.jpg",
    coord: [595, 130],
  },
  {
    name: "Cruise North Shore Beaches",
    cruise: true,
    description:
      "Welcome to the Seven-Mile Miracle. We cruise the legendary North Shore coastline past Pipeline, Sunset Beach, and Waimea Bay — hallowed ground in the surfing world. In winter, monster swells draw the best surfers on the planet to waves that can top 30 feet; in summer, the same shoreline turns to glassy, swimmable turquoise. Either season, it’s a beautiful ride through surf history.",
    image: "/images/stop-northshore.jpg",
    coord: [440, 100],
  },
  {
    name: "Macadamia Nut Farm Stop",
    description:
      "O‘ahu is home to a couple of wonderful, family-run macadamia nut farms — and depending on the day’s timing and flow, we’ll stop in at one of them (maybe even both!). Sample fresh-roasted macadamias in flavors from honey-glazed to chocolate-dipped, sip island-grown coffee, and learn how Hawai‘i became the macadamia capital of the world. Every visit is a little different — that’s part of the fun.",
    image: "/images/stop-macadamia.jpg",
    coord: [370, 200],
  },
  {
    name: "Explore Hale‘iwa Town",
    description:
      "Time to stretch your legs in the heart and soul of the North Shore. Historic Hale‘iwa town is a charming mix of plantation-era storefronts, surf shops, art galleries, food trucks, and boutiques — with a world-famous shave ice waiting if you’ve saved room. Wander at your own pace, browse for local-made souvenirs, and soak up the laid-back country vibe that defines this side of the island.",
    image: "/images/stop-haleiwa.jpg",
    coord: [340, 262],
  },
  {
    name: "Dole Plantation",
    description:
      "We wrap up the loop through O‘ahu’s red-dirt pineapple country with a stop at the world-famous Dole Plantation. Learn how pineapple shaped Hawai‘i’s history, browse the plantation store, and treat yourself to the freshest Dole Whip on the island — the perfect sweet ending before we cruise back over the central plateau toward Waikīkī.",
    image: "/images/stop-dole.jpg",
    coord: [403, 334],
  },
];

/* ------------------------------------------------------------------ */
/*  Island geometry (traced from the Summit O'ahu brochure map)        */
/* ------------------------------------------------------------------ */

const ISLAND_PATH =
  "M 296.5,713.6 L 330.0,684.8 L 414.5,676.8 L 478.3,683.2 L 529.3,667.2 L 550.0,632.0 L 538.8,608.0 L 565.9,592.0 L 586.7,612.8 L 573.9,635.2 L 586.7,656.0 L 613.8,667.2 L 656.8,680.0 L 688.7,691.2 L 714.2,699.2 L 736.5,715.2 L 762.0,734.4 L 781.2,760.0 L 800.3,772.8 L 837.0,764.8 L 868.8,756.8 L 924.6,753.6 L 975.7,753.6 L 996.4,736.0 L 1007.5,721.6 L 1055.4,680.0 L 1007.5,648.0 L 964.5,624.0 L 940.6,584.0 L 950.1,548.8 L 927.8,532.8 L 900.7,496.0 L 895.9,464.0 L 873.6,443.2 L 829.0,436.8 L 813.0,472.0 L 789.1,480.0 L 765.2,443.2 L 749.3,404.8 L 752.5,360.0 L 733.3,312.0 L 717.4,280.0 L 685.5,240.0 L 645.7,200.0 L 624.9,152.0 L 589.9,112.0 L 554.8,72.0 L 510.1,40.0 L 478.3,48.0 L 446.4,68.8 L 427.2,88.0 L 411.3,112.0 L 390.6,144.0 L 369.9,184.0 L 342.8,224.0 L 322.0,248.0 L 279.0,256.0 L 231.2,260.8 L 175.4,264.0 L 95.7,259.2 L 51.0,256.0 L 67.0,280.0 L 98.8,315.2 L 127.5,352.0 L 146.7,392.0 L 159.4,432.0 L 191.3,472.0 L 226.4,520.0 L 251.9,560.0 L 274.2,608.0 L 287.0,640.0 L 294.9,680.0 L 296.5,713.6 Z";

const START: [number, number] = [720, 700]; // Waikīkī

/** Route waypoints: start → every stop (in order) → back across the
 *  central plateau to Waikīkī. Unlabeled points shape the road so it
 *  hugs the coast instead of cutting across bays. */
const ROUTE_POINTS: [number, number][] = [
  START,
  ...stops.slice(0, 7).map((s) => s.coord),
  [690, 255], // hug the Kualoa–Kahuku coast
  stops[7].coord,
  [510, 62], // round Turtle Bay
  ...stops.slice(8).map((s) => s.coord),
  [480, 460],
  [575, 555],
  [645, 655],
  START,
];

/** Mountain-ridge caret marks — Ko'olau (windward) and Wai'anae ranges. */
const KOOLAU_CARETS: [number, number][] = [
  [622, 268],
  [652, 328],
  [681, 392],
  [710, 456],
  [738, 512],
];
const WAIANAE_CARETS: [number, number][] = [
  [168, 336],
  [194, 396],
  [221, 456],
  [248, 514],
];

/** Catmull-Rom spline → cubic Bezier path, for a smooth winding road. */
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d;
}

type NumberedStop = Stop & { label: string };
type Facing = "left" | "right";

/**
 * The Summit van — the real thing, cut out of the studio shot.
 *
 * The source photo faces LEFT, so `facing: "left"` renders it as-is and
 * `facing: "right"` mirrors it. The map flips it to match the direction
 * of travel, so the van always drives forward around the island.
 */
const VAN_W = 92; // width in SVG units at scale 1
const VAN_H = 38;

function SummitVan({
  scale = 1,
  facing = "left",
}: {
  scale?: number;
  facing?: "left" | "right";
}) {
  return (
    <g
      transform={`scale(${scale})`}
      style={{ transition: "transform 0.35s ease" }}
    >
      {/* ground shadow */}
      <ellipse cx="0" cy={VAN_H / 2 - 1} rx={VAN_W * 0.42} ry="4" fill="#000000" opacity="0.35" />
      {/* Two assets rather than a CSS mirror — flipping the photo would
          flip the SUMMIT O'AHU wordmark with it. The right-facing file has
          the logo panel re-flipped so it always reads correctly. */}
      <image
        href={
          facing === "right"
            ? "/images/summit-van-right.png"
            : "/images/summit-van.png"
        }
        x={-VAN_W / 2}
        y={-VAN_H / 2}
        width={VAN_W}
        height={VAN_H}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  The map itself — rendered full-size in the layout and again as a   */
/*  floating mini-map on mobile.                                       */
/* ------------------------------------------------------------------ */

function IslandMap({
  mini = false,
  idSuffix,
  numbered,
  routeD,
  geom,
  active,
  progressLen,
  progressPct,
  followsPath,
  duration,
  facing,
  routePathRef,
  onStopClick,
}: {
  mini?: boolean;
  idSuffix: string;
  numbered: NumberedStop[];
  routeD: string;
  geom: { total: number; lens: number[] } | null;
  active: number;
  progressLen: number;
  progressPct: number;
  followsPath: boolean;
  duration: number;
  facing: Facing;
  routePathRef?: React.Ref<SVGPathElement>;
  onStopClick?: (i: number) => void;
}) {
  const vanPos =
    active >= 0 && active < numbered.length ? numbered[active].coord : START;
  const ease = "cubic-bezier(.45,.05,.35,1)";

  return (
    <svg
      viewBox="15 15 1075 790"
      className="relative w-full h-auto select-none"
      role="img"
      aria-label="Map of O'ahu showing the circle island tour route and stops"
    >
      <defs>
        <linearGradient id={`islandFill-${idSuffix}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2d4d22" />
          <stop offset="55%" stopColor="#1a3a1a" />
          <stop offset="100%" stopColor="#16301a" />
        </linearGradient>
        <filter id={`islandGlow-${idSuffix}`} x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="6" stdDeviation="14" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Shallow water — a soft turquoise halo hugging the coast */}
      <path d={ISLAND_PATH} fill="none" stroke="#4faebe" strokeOpacity="0.10" strokeWidth="34" strokeLinejoin="round" />
      <path d={ISLAND_PATH} fill="none" stroke="#4faebe" strokeOpacity="0.14" strokeWidth="14" strokeLinejoin="round" />

      {/* Island */}
      <path
        d={ISLAND_PATH}
        fill={`url(#islandFill-${idSuffix})`}
        stroke="#e8d0a8"
        strokeOpacity="0.35"
        strokeWidth="2.5"
        filter={`url(#islandGlow-${idSuffix})`}
      />

      {!mini && (
        <>
          {/* Mountain ridges */}
          {KOOLAU_CARETS.map(([x, y], i) => (
            <path key={`k${i}`} d={`M ${x - 11},${y + 7} L ${x},${y - 7} L ${x + 11},${y + 7}`} fill="none" stroke="#a6cb8e" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
          ))}
          {WAIANAE_CARETS.map(([x, y], i) => (
            <path key={`w${i}`} d={`M ${x - 11},${y + 7} L ${x},${y - 7} L ${x + 11},${y + 7}`} fill="none" stroke="#a6cb8e" strokeOpacity="0.28" strokeWidth="3" strokeLinecap="round" />
          ))}

          {/* Offshore islets — Mānana (Rabbit Island) & Mokoli'i (Chinaman's Hat) */}
          <ellipse cx="1072" cy="645" rx="9" ry="6" fill="#1a3a1a" stroke="#e8d0a8" strokeOpacity="0.3" strokeWidth="1.5" />
          <path d="M 770,326 L 778,312 L 786,326 Z" fill="#1a3a1a" stroke="#e8d0a8" strokeOpacity="0.3" strokeWidth="1.5" />

          {/* Ocean waves */}
          <g stroke="#e8d0a8" strokeOpacity="0.16" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M 120,660 q 10,-10 20,0 q 10,10 20,0" />
            <path d="M 155,690 q 10,-10 20,0 q 10,10 20,0" />
            <path d="M 900,150 q 10,-10 20,0 q 10,10 20,0" />
            <path d="M 935,180 q 10,-10 20,0 q 10,10 20,0" />
            <path d="M 60,90 q 10,-10 20,0 q 10,10 20,0" />
          </g>

          {/* Region labels */}
          <text x="430" y="180" fill="#e8d0a8" opacity="0.32" fontSize="26" letterSpacing="10" fontStyle="italic" transform="rotate(-32,430,180)">NORTH SHORE</text>
          <text x="835" y="345" fill="#e8d0a8" opacity="0.32" fontSize="26" letterSpacing="10" fontStyle="italic" transform="rotate(55,835,345)">WINDWARD</text>
          <text x="185" y="430" fill="#e8d0a8" opacity="0.22" fontSize="22" letterSpacing="8" fontStyle="italic" transform="rotate(60,185,430)">WAI&#699;ANAE</text>

          {/* Compass */}
          <g opacity="0.55" transform="translate(1045, 90)">
            <path d="M0,-26 L8,8 L0,2 L-8,8 Z" fill="#e8d0a8" />
            <text y="30" textAnchor="middle" fill="#e8d0a8" fontSize="18" fontWeight="600">N</text>
          </g>
        </>
      )}

      {/* Route — faint full road, then the drawn gold progress */}
      <path
        d={routeD}
        fill="none"
        stroke="#e8d0a8"
        strokeOpacity="0.22"
        strokeWidth={mini ? 6 : 4}
        strokeDasharray="3 10"
        strokeLinecap="round"
      />
      <path
        ref={routePathRef}
        d={routeD}
        fill="none"
        stroke="#e8b638"
        strokeWidth={mini ? 7 : 5}
        strokeLinecap="round"
        strokeDasharray={geom ? geom.total : undefined}
        strokeDashoffset={geom ? geom.total - progressLen : undefined}
        style={{
          transition: `stroke-dashoffset ${duration}s ${ease}`,
          filter: "drop-shadow(0 0 6px rgba(232,182,56,0.45))",
        }}
      />

      {/* Waikīkī — home base */}
      <g>
        <circle cx={START[0]} cy={START[1]} r={mini ? 14 : 10} fill="#e8b638" stroke="#0d1f0d" strokeWidth="3" />
        {!mini && (
          <text x={START[0] - 4} y={START[1] + 44} fill="#f9f3e8" fontSize="24" fontWeight="600" textAnchor="middle" fontStyle="italic">
            Waik&#299;k&#299;
          </text>
        )}
      </g>

      {/* Stop markers */}
      {numbered.map((stop, i) => {
        const [cx, cy] = stop.coord;
        const done = i < active;
        const isActive = i === active;
        const num = stop.label.startsWith("Stop")
          ? String(Number(stop.label.slice(5)))
          : null;
        const r = mini ? 20 : 16;
        return (
          <g
            key={stop.name}
            onClick={onStopClick ? () => onStopClick(i) : undefined}
            className={onStopClick ? "cursor-pointer" : undefined}
            role={onStopClick ? "button" : undefined}
            aria-label={onStopClick ? `Jump to ${stop.name}` : undefined}
          >
            {isActive && (
              <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke="#e8b638" strokeWidth="2" opacity="0.7" className="animate-ping" style={{ transformOrigin: `${cx}px ${cy}px` }} />
            )}
            {stop.cruise ? (
              <rect
                x={cx - (mini ? 11 : 9)}
                y={cy - (mini ? 11 : 9)}
                width={mini ? 22 : 18}
                height={mini ? 22 : 18}
                rx="3"
                transform={`rotate(45 ${cx} ${cy})`}
                fill={done || isActive ? "#e8b638" : "#1a3a1a"}
                stroke={done || isActive ? "#0d1f0d" : "#e8d0a8"}
                strokeOpacity={done || isActive ? 1 : 0.5}
                strokeWidth="2.5"
              />
            ) : (
              <>
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={done || isActive ? "#e8b638" : "#1a3a1a"}
                  stroke={done || isActive ? "#0d1f0d" : "#e8d0a8"}
                  strokeOpacity={done || isActive ? 1 : 0.55}
                  strokeWidth="2.5"
                />
                <text
                  x={cx}
                  y={cy + (mini ? 7 : 5.5)}
                  textAnchor="middle"
                  fontSize={mini ? 20 : 16}
                  fontWeight="700"
                  fill={done || isActive ? "#0d1f0d" : "#f9f3e8"}
                >
                  {num}
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* The van — drawn last so it always rides on top of the markers */}
      <g
        style={
          followsPath
            ? ({
                offsetPath: `path("${routeD}")`,
                offsetDistance: `${progressPct}%`,
                offsetRotate: "0deg",
                transition: `offset-distance ${duration}s ${ease}`,
              } as React.CSSProperties)
            : ({
                transform: `translate(${vanPos[0]}px, ${vanPos[1]}px)`,
                transition: `transform ${duration}s ${ease}`,
              } as React.CSSProperties)
        }
      >
        <SummitVan scale={mini ? 3.3 : 2.15} facing={facing} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */

export default function TourStops({
  variant = "standard",
}: {
  variant?: "standard" | "private";
}) {
  const isPrivate = variant === "private";

  // Number real stops only — cruises are woven into the flow, unnumbered.
  let stopCounter = 0;
  const numbered: NumberedStop[] = stops.map((stop) => {
    if (stop.cruise) return { ...stop, label: "En Route" };
    stopCounter += 1;
    return { ...stop, label: `Stop ${String(stopCounter).padStart(2, "0")}` };
  });

  const routeD = useMemo(() => smoothPath(ROUTE_POINTS), []);

  const routeRef = useRef<SVGPathElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mapBoxRef = useRef<HTMLDivElement>(null);
  const cardsWrapRef = useRef<HTMLDivElement>(null);
  const prevLenRef = useRef(0);

  const [active, setActive] = useState(-1); // -1 = parked in Waikīkī
  const [geom, setGeom] = useState<{
    total: number;
    lens: number[];
    heads: Facing[]; // direction of travel arriving at each stop
    homeHead: Facing; // direction on the final run back to Waikīkī
  } | null>(null);
  const [followsPath, setFollowsPath] = useState(false);
  const [duration, setDuration] = useState(1.2);
  const [mapOnScreen, setMapOnScreen] = useState(true);
  const [cardsOnScreen, setCardsOnScreen] = useState(false);

  // Measure the route and find each stop's distance along it.
  useEffect(() => {
    const el = routeRef.current;
    if (!el) return;
    const total = el.getTotalLength();
    const samples = 900;
    const lens = stops.map(() => 0);
    const best = stops.map(() => Infinity);
    for (let i = 0; i <= samples; i++) {
      const l = (i / samples) * total;
      const pt = el.getPointAtLength(l);
      stops.forEach((s, si) => {
        const dx = pt.x - s.coord[0];
        const dy = pt.y - s.coord[1];
        const d = dx * dx + dy * dy;
        if (d < best[si]) {
          best[si] = d;
          lens[si] = l;
        }
      });
    }
    // Which way is the van pointing when it reaches each stop? Sample the
    // path just before and just after, and read the sign of dx.
    const headingAt = (l: number): Facing => {
      const a = el.getPointAtLength(Math.max(0, l - 14));
      const b = el.getPointAtLength(Math.min(total, l + 14));
      return b.x - a.x >= 0 ? "right" : "left";
    };
    const heads = lens.map(headingAt);
    const homeA = el.getPointAtLength(total - 40);
    const homeB = el.getPointAtLength(total);
    const homeHead: Facing = homeB.x - homeA.x >= 0 ? "right" : "left";

    setGeom({ total, lens, heads, homeHead });
    if (
      typeof CSS !== "undefined" &&
      CSS.supports?.('offset-path', 'path("M0 0 L1 1")')
    ) {
      setFollowsPath(true);
    }
  }, [routeD]);

  // Watch the cards; light up the map as each one crosses mid-screen.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.index);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
    );
    cardRefs.current.forEach((c) => c && obs.observe(c));
    return () => obs.disconnect();
  }, []);

  // Drive time scales with distance — long legs cruise, short hops are quick.
  // The final run home from Dole Plantation is deliberately slow: a long,
  // easy cruise back across the plateau to Waikīkī at the end of the day.
  useEffect(() => {
    if (!geom) return;
    const goingHome = active >= stops.length;
    const newLen = goingHome
      ? geom.total
      : active >= 0
        ? geom.lens[active]
        : 0;
    const delta = Math.abs(newLen - prevLenRef.current);
    prevLenRef.current = newLen;
    const secs = goingHome
      ? 9
      : Math.min(3, Math.max(0.7, 0.6 + (delta / geom.total) * 5));
    setDuration(secs);
  }, [active, geom]);

  // Arrive at Dole, linger for a Dole Whip, then set off on the long slow
  // cruise home. The timer cancels if the reader scrolls away, so the van
  // only heads home if you actually stayed for the last stop.
  useEffect(() => {
    if (active !== stops.length - 1) return;
    const t = setTimeout(() => setActive(stops.length), 5000);
    return () => clearTimeout(t);
  }, [active]);

  // Mobile mini-map: appears when the big map has scrolled away but the
  // stop cards are still on screen.
  useEffect(() => {
    const mapEl = mapBoxRef.current;
    const cardsEl = cardsWrapRef.current;
    if (!mapEl || !cardsEl) return;
    const mapObs = new IntersectionObserver(
      ([e]) => setMapOnScreen(e.isIntersecting),
      { threshold: 0.15 }
    );
    const cardsObs = new IntersectionObserver(
      ([e]) => setCardsOnScreen(e.isIntersecting),
      { rootMargin: "0px 0px -20% 0px", threshold: 0 }
    );
    mapObs.observe(mapEl);
    cardsObs.observe(cardsEl);
    return () => {
      mapObs.disconnect();
      cardsObs.disconnect();
    };
  }, []);

  const goTo = (i: number) =>
    cardRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });

  const goingHome = active >= stops.length;
  const progressLen = geom
    ? goingHome
      ? geom.total
      : active >= 0
        ? geom.lens[active]
        : 0
    : 0;
  const progressPct = geom ? (progressLen / geom.total) * 100 : 0;
  const showMini = !mapOnScreen && cardsOnScreen;

  // Point the van the way it's actually driving.
  const facing: Facing = !geom
    ? "right"
    : goingHome
      ? geom.homeHead
      : active >= 0
        ? geom.heads[active]
        : "right"; // parked in Waikīkī, first leg heads east

  const mapProps = {
    numbered,
    routeD,
    geom,
    active,
    progressLen,
    progressPct,
    followsPath,
    duration,
    facing,
  };

  return (
    <section id="journey" className="section-padding bg-palm-950">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="label-sm text-gold-400">
            {isPrivate ? "The Private Tour Route" : "The Circle Island Route"}
          </span>
          <h2 className="heading-lg text-sand-50 mt-3 mb-5">
            {isPrivate
              ? "Your Journey, Your Way"
              : "Your Journey Around O'ahu"}
          </h2>
          <p className="body-lg text-sand-300/80 max-w-2xl mx-auto">
            {isPrivate ? (
              <>
                Think of this itinerary as a starting point, not a script. Your
                private tour follows our classic circle island route by default
                — but it&apos;s your day. Linger longer where you fall in love,
                skip what doesn&apos;t call to you, or add stops all your own.
                After booking, we&apos;ll work with you to shape the perfect
                day.
              </>
            ) : (
              <>
                From volcanic craters to legendary shrimp trucks, each stop
                reveals another facet of O&apos;ahu&apos;s extraordinary
                beauty. Follow the road around the island — scroll the stops,
                or tap any marker on the map to jump ahead.
              </>
            )}
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[1.35fr_1fr] lg:gap-10 xl:gap-12 lg:items-start">
          {/* ------------------------------------------------ The Map */}
          <div ref={mapBoxRef} className="lg:sticky lg:top-20 mb-12 lg:mb-0">
            <div className="relative rounded-2xl border border-palm-800/60 bg-gradient-to-b from-palm-900/40 to-palm-950 p-3 md:p-4 shadow-2xl overflow-hidden">
              {/* ocean shimmer */}
              <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_30%_20%,#4faebe_0%,transparent_50%),radial-gradient(circle_at_80%_80%,#4faebe_0%,transparent_40%)]" />
              <IslandMap
                {...mapProps}
                idSuffix="main"
                routePathRef={routeRef}
                onStopClick={goTo}
              />
              <p className="relative text-center text-sand-400/60 text-xs mt-3 italic">
                {goingHome ? (
                  <>
                    <span className="text-gold-400 font-semibold not-italic">
                      Heading Home
                    </span>
                    {" · "}
                    Back to Waik&#299;k&#299;, happy hour pending
                  </>
                ) : active >= 0 ? (
                  <>
                    <span className="text-gold-400 font-semibold not-italic">{numbered[active].label}</span>
                    {" · "}
                    {numbered[active].name}
                  </>
                ) : (
                  "Scroll the stops — or tap a marker to jump ahead"
                )}
              </p>
            </div>
          </div>

          {/* ------------------------------------------------ The Stops */}
          <div ref={cardsWrapRef} className="space-y-6">
            {numbered.map((stop, index) => (
              <div
                key={stop.name}
                data-index={index}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={`scroll-mt-28 rounded-xl overflow-hidden border backdrop-blur-sm transition-all duration-500 ${
                  index === active
                    ? "bg-palm-900/70 border-gold-500/60 shadow-xl shadow-gold-500/5"
                    : "bg-palm-900/40 border-palm-800/50 hover:border-gold-500/30"
                }`}
              >
                {/* Image(s) */}
                <div className="relative h-56 md:h-64 w-full">
                  {stop.image2 ? (
                    <div className="flex h-full w-full">
                      <div className="relative w-1/2 h-full">
                        <Image src={stop.image} alt={stop.name} fill className="object-cover brightness-110 saturate-105" />
                      </div>
                      <div className="relative w-1/2 h-full border-l-2 border-palm-950">
                        <Image src={stop.image2} alt={stop.image2Alt || stop.name} fill className="object-cover brightness-110 saturate-105" />
                      </div>
                    </div>
                  ) : (
                    <Image src={stop.image} alt={stop.name} fill className="object-cover brightness-110 saturate-105" />
                  )}
                  {/* Just enough scrim to keep the stop label legible —
                      the photo itself stays bright. */}
                  <div className="absolute inset-0 bg-gradient-to-t from-palm-950/55 via-transparent to-transparent pointer-events-none" />
                  <span
                    className={`absolute bottom-3 left-4 text-xs font-mono tracking-wider ${
                      stop.cruise ? "text-ocean-300/90 italic" : "text-gold-400/90"
                    }`}
                  >
                    {stop.cruise ? "En Route · Scenic Drive" : stop.label}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-sand-50 mb-2">
                    {stop.name}
                  </h3>
                  <p className="text-sand-300/70 text-sm leading-relaxed">
                    {stop.description}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* Floating mini-map (mobile) — the big map, miniaturized, docked
            bottom-right while you scroll the stops. Tap to return to it. */}
        <div
          className={`lg:hidden fixed bottom-4 right-4 z-40 w-40 transition-all duration-500 ${
            showMini
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-90 pointer-events-none"
          }`}
          onClick={() =>
            mapBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
          }
          role="button"
          aria-label="Show the full tour map"
        >
          <div className="rounded-xl border border-gold-500/40 bg-palm-950/95 shadow-2xl shadow-black/50 p-2 backdrop-blur-sm">
            <IslandMap {...mapProps} mini idSuffix="mini" />
            <p className="text-center text-[10px] text-sand-300/80 mt-1 truncate px-1">
              {goingHome ? (
                <span className="text-gold-400 font-semibold">
                  Heading Home
                </span>
              ) : active >= 0 ? (
                <>
                  <span className="text-gold-400 font-semibold">
                    {numbered[active].label}
                  </span>{" "}
                  · {numbered[active].name}
                </>
              ) : (
                "The Journey"
              )}
            </p>
          </div>
        </div>

        {/* Expectation note */}
        <p className="text-center text-sand-400/60 text-sm italic mt-14 max-w-2xl mx-auto">
          Every day on the island is a little different — stop order and
          timing may shift with weather, traffic, and the day&apos;s flow. That
          flexibility is how we keep the magic in the journey.
        </p>
      </div>
    </section>
  );
}
