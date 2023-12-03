import fs from 'fs';

const input = fs.readFileSync('src/day1/input.txt', 'utf8').split('\n');
const testInput = ['1abc2', 'pqr3stu8vwx', 'a1b2c3d4e5f', 'treb7uchet'];
const testInput2 = [
	'two1nine',
	'eightwothree',
	'abcone2threexyz',
	'xtwone3four',
	'4nineeightseven2',
	'zoneight234',
	'7pqrstsixteen'
];
const alternates = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function part1(input: string[]) {
	let final = 0;
	let now = performance.now();
	for (let i = 0; i < input.length; i++) {
		let first: string | undefined;
		let second: string | undefined;
		for (let j = 0; j < input[i].length; j++) {
			if (first && second) break;
			if (!first) {
				let startNum = parseInt(input[i][j]);
				if (startNum) first = input[i][j];
			}
			if (!second) {
				let endNum = parseInt(input[i][input[i].length - j - 1]);
				if (endNum) second = input[i][input[i].length - j - 1];
			}
		}
		if (first && second) {
			final += parseInt(first + second);
		}
	}
	let elapsed = (performance.now() - now).toFixed(2);
	return [final, elapsed];
}

function part2(input: string[]) {
	let final = 0;
	let now = performance.now();
	for (let i = 0; i < input.length; i++) {
		let first: string | undefined;
		let visited1 = '';
		let second: string | undefined;
		let visited2 = '';
		for (let j = 0; j < input[i].length; j++) {
			if (first && second) break;
			if (!first) {
				visited1 = input[i].slice(0, j);
				let spelled = hasSpelledNumber(visited1);
				if (spelled) {
					first = spelled;
				} else {
					let startNum = parseInt(input[i][j]);
					if (startNum) first = input[i][j];
				}
			}
			if (!second) {
				visited2 = input[i].slice(-(j + 1));
				let spelled = hasSpelledNumber(visited2);
				if (spelled) {
					second = spelled;
				} else {
					let endNum = parseInt(input[i][input[i].length - j - 1]);
					if (endNum) second = input[i][input[i].length - j - 1];
				}
			}
		}
		if (first && second) {
			final += parseInt(first + second);
		}
	}
	let elapsed = (performance.now() - now).toFixed(2);
	return [final, elapsed];
}

function hasSpelledNumber(input: string) {
	for (let i = 0; i < alternates.length; i++) {
		if (input.includes(alternates[i])) return values[i].toString();
	}
}

let answer1 = part1(input);
let answer2 = part2(input);
console.log(`Result: ${answer1[0]} in ${answer1[1]}ms`);
console.log('---------------------');
console.log(`Result: ${answer2[0]} in ${answer2[1]}ms`);
