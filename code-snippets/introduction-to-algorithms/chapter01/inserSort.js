/**
 * input: [5, 6, 7, 1, 9, 3, 0, 12]
 * step1: [1, 5, 6, 7, 9, 3, 0, 12]
 * step2: [1, 3, 5, 6, 7, 9, 0, 12]
 * step3: [0, 1, 3, 5, 6, 7, 9, 12]
 */

export default function insertSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    const target = arr[i + 1]
    let j = i
    while (j >= 0 && arr[j] > target) {
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = target
  }
}
