export function initStatusMap<T extends readonly string[]>(
  statuses: T,
): Record<T[number], number> {
  return Object.fromEntries(statuses.map((status) => [status, 0])) as Record<
    T[number],
    number
  >;
}

export const generateModelCode = (prefix: string): string => {
  const uid = crypto.randomUUID().replace(/-/g, "").slice(0, 5).toUpperCase();
  return `${prefix}-${uid}`;
};
