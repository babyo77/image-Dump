export function calculatePercentageMatching(
  array1: string[],
  array2: string[]
): string {
  array1 = array1.map((str) => str.toLowerCase().trim());
  array2 = array2.map((str) => str.toLowerCase().trim());

  let set2 = new Set(array2);

  let count = 0;
  for (let string of array1) {
    if (set2.has(string)) {
      count++;
    }
  }

  let similarityPercentage = (count / (array1.length + array2.length)) * 100;

  return similarityPercentage.toFixed(2);
}
