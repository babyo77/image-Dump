export function calculatePercentageMatching(
  array1: string[],
  array2: string[]
): string {
  const lowerCaseArray1 = array1.map((item) => item.toLowerCase());
  const lowerCaseArray2 = array2.map((item) => item.toLowerCase());

  const set1 = new Set(lowerCaseArray1);
  const set2 = new Set(lowerCaseArray2);

  const intersection = new Set(
    [...Array.from(set1)].filter((x) => set2.has(x))
  );

  const union = new Set([...Array.from(set1), ...Array.from(set2)]);

  const Similarity = intersection.size / union.size;

  const similarityPercentage = Similarity * 100;

  if (similarityPercentage === 0) {
    return "1.00";
  }
  return similarityPercentage.toFixed(2);
}
