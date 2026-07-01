/** Metadata for each explodable Starship component. */
export type PartKey =
  | 'ship'
  | 'booster'
  | 'raptorsInner'
  | 'raptorsOuter'
  | 'gridFins'
  | 'bodyFlaps'
  | 'chopsticks'

export interface PartInfo {
  key: PartKey
  /** Short display name used on the floating label + panel heading. */
  name: string
  /** One-line fact shown on the floating <Html> label when exploded. */
  fact: string
  /** Deeper software / systems write-up shown in the side panel. */
  panel: string
  /** Position offset (world units) when exploded. */
  explodePosition: [number, number, number]
  /** Uniform-ish scale when exploded (x, y, z) — used to fan / splay parts. */
  explodeScale: [number, number, number]
  /** Anchor for the floating label, in the group's local space. */
  labelAnchor: [number, number, number]
  /** Stagger order for the GSAP explode timeline. */
  order: number
}

export const PARTS: Record<PartKey, PartInfo> = {
  ship: {
    key: 'ship',
    name: 'Ship · Upper Stage',
    fact: 'Docking port added in V3 · enables orbital refuelling for Moon/Mars missions',
    panel:
      'The upper stage is a fully-fledged spacecraft: guidance, navigation & control (GNC) software flies it through ascent, coast, and re-entry. Flight computers run a triple-redundant control loop, voting on sensor data before every actuator command. The V3 nose adds a docking port so two ships can mate in orbit and transfer propellant — the key to refuelling for Moon and Mars.',
    explodePosition: [0, 4.2, 0],
    explodeScale: [1, 1, 1],
    labelAnchor: [1.6, 5.8, 0],
    order: 0,
  },
  booster: {
    key: 'booster',
    name: 'Super Heavy Booster',
    fact: 'Returns to the launch site under software control for a tower catch',
    panel:
      'Super Heavy is 71 m of stainless steel and the most powerful booster ever flown. After stage separation the flight software flips it, relights a subset of engines for the boostback burn, then threads a precise trajectory home. A final landing burn hands the vehicle to the tower — all closed-loop, all autonomous.',
    explodePosition: [0, -4.5, 0],
    explodeScale: [1, 1, 1],
    labelAnchor: [1.6, -1.5, 0],
    order: 1,
  },
  raptorsInner: {
    key: 'raptorsInner',
    name: 'Inner Raptors (13)',
    fact: 'Gimballing centre engines · steer the booster on a networked avionics bus',
    panel:
      'The 13 inner Raptors gimbal on hydraulic actuators to vector thrust and steer the stack. Each engine is a node on a networked avionics bus — thousands of sensor channels stream to the flight computer, which trims mixture ratio and gimbal angle hundreds of times per second.',
    explodePosition: [0, -1.2, 0],
    explodeScale: [2.1, 1, 2.1],
    labelAnchor: [1.4, -4.6, 0],
    order: 2,
  },
  raptorsOuter: {
    key: 'raptorsOuter',
    name: 'Outer Raptors (20)',
    fact: '33 Raptor 3 engines total · full-flow staged combustion · fixed outer ring',
    panel:
      'The 20 fixed outer Raptors provide the bulk of liftoff thrust. Raptor 3 uses full-flow staged combustion — both propellants pass through preburners — for extreme efficiency. Engine-out tolerance is baked into the software: the controller can lose engines and re-plan the ascent in real time.',
    explodePosition: [0, -2.4, 0],
    explodeScale: [2.6, 1, 2.6],
    labelAnchor: [2.2, -4.6, 0],
    order: 3,
  },
  gridFins: {
    key: 'gridFins',
    name: 'Grid Fins',
    fact: 'Steered by software-controlled hydraulics · guide the booster back to the catch arms',
    panel:
      'The grid fins are the booster’s steering surfaces on the way down. Software-controlled hydraulics articulate them to bleed energy and fly a pinpoint approach to the tower. Unlike Falcon 9, Super Heavy keeps its fins fixed-mount at the top and never folds them — simpler, lighter, software-trimmed.',
    explodePosition: [0, 0, 0],
    explodeScale: [1.9, 1, 1.9],
    labelAnchor: [1.6, 3.4, 0],
    order: 4,
  },
  bodyFlaps: {
    key: 'bodyFlaps',
    name: 'Body Flaps',
    fact: 'Four flaps driven by onboard GNC software · belly-flop, then flip vertical',
    panel:
      'Four flaps let the ship fall belly-first through the atmosphere like a skydiver. Onboard GNC software modulates each flap independently to hold attitude, then commands the dramatic flip-to-vertical just before landing. It is active aerodynamic control — the vehicle is unstable without the software in the loop.',
    explodePosition: [0, 0.6, 0],
    explodeScale: [1.8, 1, 1.8],
    labelAnchor: [1.6, 4.9, 0],
    order: 5,
  },
  chopsticks: {
    key: 'chopsticks',
    name: 'Mechazilla Chopsticks',
    fact: 'First booster catch Oct 2024 · arms are positioned by software, not human hand',
    panel:
      'The tower’s “chopstick” arms caught a returning booster for the first time in October 2024. Their position is commanded by software synced to the vehicle’s live telemetry — the arms and the descending booster converge on a shared solution in the final seconds. No human hand is fast enough; it is a fully computed rendezvous.',
    explodePosition: [-2.6, 1.2, 0],
    explodeScale: [1, 1, 1],
    labelAnchor: [-1.2, 2.6, 0],
    order: 6,
  },
}

export const PART_ORDER: PartKey[] = Object.values(PARTS)
  .sort((a, b) => a.order - b.order)
  .map((p) => p.key)
