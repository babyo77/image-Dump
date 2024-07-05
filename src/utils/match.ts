export function calculatePercentageMatching(
  array1: string[],
  array2: string[]
): string {
  const set1 = new Set(array1);
  const set2 = new Set(array2);

  const intersection = new Set(
    [...Array.from(set1)].filter((x) => set2.has(x))
  );

  const union = new Set([...Array.from(set1), ...Array.from(set2)]);

  const Similarity = intersection.size / union.size;

  let similarityPercentage = Similarity * 100;

  return similarityPercentage.toFixed(2);
}
