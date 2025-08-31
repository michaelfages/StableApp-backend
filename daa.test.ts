import { deferredAcceptanceAlgorithm } from "./daa";

// Test data: 3 men and 3 women with hardcoded preferences
const menPrefs = [
  [0, 1, 2], // Man 0 prefers Woman 0 > 1 > 2
  [1, 0, 2], // Man 1 prefers Woman 1 > 0 > 2
  [1, 2, 0], // Man 2 prefers Woman 1 > 2 > 0
];

const womenPrefs = [
  [2, 1, 0], // Woman 0 prefers Man 2 > 1 > 0
  [0, 1, 2], // Woman 1 prefers Man 0 > 1 > 2
  [2, 0, 1], // Woman 2 prefers Man 2 > 0 > 1
];

const matches = deferredAcceptanceAlgorithm(menPrefs, womenPrefs);

console.log("Stable matches (man, woman):");
for (const pair of matches) {
  console.log(`Man ${pair.man} - Woman ${pair.woman}`);
}
