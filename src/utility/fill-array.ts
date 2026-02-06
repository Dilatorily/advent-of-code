export default function fillArray<T>(length: number, fill: T = '' as T): T[] {
  return [...Array(length).fill(undefined)].map(() => JSON.parse(JSON.stringify(fill)));
}
