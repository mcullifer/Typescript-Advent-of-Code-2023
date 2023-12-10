import { Reader } from '@/util/reader';

const test = Reader.read(9, 'test');
const input = Reader.read(9, 'input');

function nextLine(input: number[]): number {
	if (input.every((x) => x === 0)) {
		return 0;
	}
	let diff = new Array(input.length - 1).fill(0);
	for (let i = 0; i < input.length - 1; i++) {
		diff[i] = input[i + 1] - input[i];
	}
	return diff[diff.length - 1] + nextLine(diff);
}

function part1(input: string[]) {
	let final = 0;
	for (let line of input) {
		let clean = line.split(' ').map((x) => parseInt(x));
		final += clean[clean.length - 1] + nextLine(clean);
	}
	return final;
}

function part2(input: string[]) {
	let final = 0;
	for (let line of input) {
		let clean = line
			.split(' ')
			.map((x) => parseInt(x))
			.reverse();
		final += clean[clean.length - 1] + nextLine(clean);
	}
	return final;
}

let now = performance.now();
let answer1 = part1(test);
let elapsed = (performance.now() - now).toFixed(2);
console.log(`Result: ${answer1} in ${elapsed}ms`);

console.log('---------------------');

now = performance.now();
let answer2 = part2(input);
elapsed = (performance.now() - now).toFixed(2);
console.log(`Result: ${answer2} in ${elapsed}ms`);
