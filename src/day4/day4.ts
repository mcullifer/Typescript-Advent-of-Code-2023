import fs from 'fs';
const test = fs.readFileSync('src/day4/test.txt', 'utf8').split('\n');
const input = fs.readFileSync('src/day4/input.txt', 'utf8').split('\n');

function parseNumbers(input: string[]) {
	let cleaned: number[] = [];
	for (let number of input) {
		if (number === '') continue;
		number = number.replace('\r', '');
		let parsed = parseInt(number);
		if (!isNaN(parsed)) cleaned.push(parsed);
	}
	return cleaned;
}

function parseInput(input: string) {
	let allNumbers = input.split(': ')[1];
	let splitNumbers = allNumbers.split(' | ');
	let winning = splitNumbers[0].split(' ');
	let mine = splitNumbers[1].split(' ');
	let w = parseNumbers(winning);
	let m = parseNumbers(mine);
	let winningNumbers = new Set(w);
	let myNumbers = new Set(m);
	return new Set([...winningNumbers].filter((x) => myNumbers.has(x)));
}

function parseCopies(scores: number[]) {
	let copyCounts: number[] = Array(scores.length).fill(1);
	let copies = 0;
	for (let i = 0; i < copyCounts.length; i++) {
		for (let k = 1; k < scores[i] + 1; k++) {
			if (i + k > copyCounts.length) break;
			copyCounts[i + k] += copyCounts[i];
		}
		copies += copyCounts[i];
	}

	return copies;
}

function part1(input: string[]) {
	let score = 0;
	for (let i = 0; i < input.length; i++) {
		let intersect = parseInput(input[i]);
		if (intersect.size == 0) continue;
		score += Math.pow(2, intersect.size - 1);
	}
	return score;
}

function part2(input: string[]) {
	let scores: number[] = [];
	for (let i = 0; i < input.length; i++) {
		let intersection = parseInput(input[i]);
		scores.push(intersection.size);
	}
	let copies = parseCopies(scores);
	return copies;
}

let now = performance.now();
let answer1 = part1(input);
let elapsed = (performance.now() - now).toFixed(2);
console.log(`Result: ${answer1} in ${elapsed}ms`);

console.log('---------------------');

now = performance.now();
let answer2 = part2(input);
elapsed = (performance.now() - now).toFixed(2);
console.log(`Result: ${answer2} in ${elapsed}ms`);
