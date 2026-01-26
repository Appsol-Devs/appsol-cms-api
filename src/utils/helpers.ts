export function initStatusMap<T extends readonly string[]>(
  statuses: T,
): Record<T[number], number> {
  return Object.fromEntries(statuses.map((status) => [status, 0])) as Record<
    T[number],
    number
  >;
}
