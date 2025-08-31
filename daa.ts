// Deferred Acceptance Algorithm (DAA) implementation
// This function matches n men to n women based on ranked preferences.

export type Preferences = number[][];
export type Match = { man: number; woman: number }[];

/**
 * Stable marriage via Gale-Shapley (DAA) algorithm.
 * @param menPrefs - menPrefs[i] is the preference list of man i (array of woman indices, ordered by preference)
 * @param womenPrefs - womenPrefs[j] is the preference list of woman j (array of man indices, ordered by preference)
 * @returns Array of matches: { man: i, woman: j }
 */
export function deferredAcceptanceAlgorithm(
  menPrefs: Preferences,
  womenPrefs: Preferences
): Match {
  const n = menPrefs.length;
  // womanProposals[j][i]: index in her list for man i
  const womanRanks = womenPrefs.map(wList => {
    const rank = Array(n).fill(0);
    wList.forEach((manIndex, pos) => { rank[manIndex] = pos; });
    return rank;
  });

  const freeMen: number[] = [];
  const proposals: number[] = Array(n).fill(0); // proposals[i]: next woman to propose for man i
  const engagedTo: number[] = Array(n).fill(-1); // woman j is engaged to man i, or -1 if free

  for (let i = 0; i < n; i++) freeMen.push(i);

  while (freeMen.length > 0) {
    const man = freeMen.shift()!;
    const woman = menPrefs[man][proposals[man]];
    proposals[man]++;

    if (engagedTo[woman] === -1) {
      engagedTo[woman] = man;
    } else {
      const currentMan = engagedTo[woman];
      // Lower rank is better. If she prefers new man, switch.
      if (womanRanks[woman][man] < womanRanks[woman][currentMan]) {
        engagedTo[woman] = man;
        freeMen.push(currentMan);
      } else {
        freeMen.push(man);
      }
    }
  }

  const matches: Match = [];
  for (let j = 0; j < n; j++) {
    matches.push({ man: engagedTo[j], woman: j });
  }
  return matches;
}
