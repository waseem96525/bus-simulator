# 🚌 Metro Transit 3D — Bus Driver Simulator

A 3D city-bus simulator that runs entirely in the browser. Drive **Line 12 · City Loop**,
stop at the kerb, open the doors, board waiting passengers and drop them off at their stops.

No build step, no dependencies to install — it is a single self-contained HTML file.

## Play

Open `index.html` in any modern browser, or visit the deployed site.

## Controls

| Input | Action |
|---|---|
| `W` / `↑` | Throttle |
| `S` / `↓` | Service brake |
| `A` `D` / `←` `→` | Steer (also works while the on-screen wheel is shown) |
| `Space` | Parking brake |
| `E` | Doors |
| `B` | Stop-request bell |
| `C` | Camera (chase / cabin / kerb / wide) |
| `H` | Horn (scatters pedestrians, clears broken-down vehicles) |
| `M` | Passenger manifest |
| `L` | Headlights |

On touch devices: drag the wheel or use the ◀▶ buttons, and hold the on-screen GAS / BRAKE pedals.

## How the shift works

1. The HUD shows the **next stop** and its distance; a cyan ghost bus marks the exact bay.
2. Pull into the bay, stop, and press **E**. Alighting passengers step off first, then
   waiting passengers board, walk down the aisle and take their seats.
3. The route only advances when the stop is actually serviced — closing the doors early
   cancels the service and you stay on the stop.
4. Fares are paid on exit, distance-based. Happy riders leave a tip.

## Scoring

- **On-time departures** — dwell time against the number of passengers handled
- **Happy pax** — patience and satisfaction; full buses cause passengers to give up
- **Comfort** — hard braking and collisions reduce it
- **Fines** — speeding (50 km/h limit), collisions, harsh braking, red-light violations
- Grade **S → D** at 19:00, plus a personal best saved in `localStorage`

## Notable systems

- Automatic day/night cycle driven by the shift clock (07:00 → 19:00) with a gradient sky,
  travelling sun/moon, street lamps, cabin lighting and auto headlights
- Rush-hour demand curve (peaks ≈08:00 and ≈17:30)
- Detailed procedural vehicles: 8 body types including taxis, police and rival buses,
  working lights, indicators, brake lights and steering wheels
- Road-graph traffic with traffic lights, lane discipline, car following and yielding
- Broken-down-vehicle incidents cleared with the horn
- Weather: clear or rain, with wipers, wet-road reflections and reduced visibility

## Deploying to Vercel

The entry point **must** be named `index.html` in the repository root.

- Framework Preset: **Other**
- Build Command: *(leave empty)*
- Output Directory: `.` *(or leave empty)*

Then push and deploy.

## Requirements

The page loads two CDN scripts at runtime, so it needs internet access on first load:

- `https://cdn.tailwindcss.com` — interface styling (a plain-CSS fallback is built in)
- `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js` — the 3D engine

If either is blocked, the page shows a readable error instead of a blank screen. WebGL
with hardware acceleration is required.

## Files

| File | Purpose |
|---|---|
| `index.html` | The game — this is what Vercel serves |
| `3d_bus_simulator.html` | Working copy of the same file |