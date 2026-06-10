// Returns a random element from a given array of elements.
export function pickRandom<T>(arr: T[]): T {
	const index = Math.floor(Math.random() * arr.length);
	return arr[index];
}
