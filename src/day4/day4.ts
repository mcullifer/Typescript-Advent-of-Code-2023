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
	let winningNumbers = parseNumbers(winning);
	let myNumbers = parseNumbers(mine);
	return { winningNumbers, myNumbers };
}

function parseCopies(scores: number[]) {
	let copyCounts: number[] = Array(scores.length).fill(1);
	let copies = 0;
	for (let i = 0; i < copyCounts.length; i++) {
		for (let j = 0; j < copyCounts[i]; j++) {
			for (let k = 1; k < scores[i] + 1; k++) {
				if (i + k > copyCounts.length) break;
				copyCounts[i + k] += 1;
			}
		}
		copies += copyCounts[i];
	}

	return copies;
}

function part1(input: string[]) {
	let score = 0;
	for (let i = 0; i < input.length; i++) {
		let { winningNumbers, myNumbers } = parseInput(input[i]);
		let intersection = winningNumbers.filter((x) => myNumbers.includes(x));
		if (intersection.length == 0) continue;
		score += Math.pow(2, intersection.length - 1);
	}
	return score;
}

function part2(input: string[]) {
	let scores: number[] = [];
	for (let i = 0; i < input.length; i++) {
		let { winningNumbers, myNumbers } = parseInput(input[i]);
		let matchingCount = 0;
		for (let number of myNumbers) {
			if (winningNumbers.includes(number)) {
				matchingCount++;
			}
		}
		scores.push(matchingCount);
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
