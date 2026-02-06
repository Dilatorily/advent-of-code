export default function reverseString(string: string): string {
  return [...string].reverse().join('');
}
