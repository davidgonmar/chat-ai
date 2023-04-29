// Returns the first n names of a full name
export default function getFirstNames(name: string, n: number): string {
  return name.split(' ').slice(0, n).join(' ');
}
