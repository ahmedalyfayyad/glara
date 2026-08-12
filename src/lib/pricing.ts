/** Lab surcharges. The client mirrors these for the live preview; the server is authoritative. */
export const HARDWARE_DELTA: Record<string, number> = { brushed: 0, black: 120, gold: 260 };
export const BASIN_DELTA: Record<string, number> = { integrated: 0, vessel: 180, double: 640 };

export function configurationPrice(
  basePrice: number,
  finishDelta: number,
  sizeDelta: number,
  hardware: string,
  basin: string,
): number {
  return (
    basePrice +
    finishDelta +
    sizeDelta +
    (HARDWARE_DELTA[hardware] ?? 0) +
    (BASIN_DELTA[basin] ?? 0)
  );
}
