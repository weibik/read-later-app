type StaleCandidate = {
  id: number;
  status: string;
  pendingSince: Date | string;
};

export function getStaleIds(
  list: StaleCandidate[],
  now: number,
  staleMs: number,
): number[] {
  return list
    .filter(
      (b) =>
        b.status === 'pending' &&
        now - new Date(b.pendingSince).getTime() > staleMs,
    )
    .map((b) => b.id);
}
