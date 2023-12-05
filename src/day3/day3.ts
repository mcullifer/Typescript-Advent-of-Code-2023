import fs from 'fs';
const test = fs.readFileSync('src/day3/test.txt', 'utf8').split('\n');
const input = fs.readFileSync('src/day3/input.txt', 'utf8').split('\n');
const period = 46;
const asciiNumberRange = [48, 57];
let adjacentStarsWithNumber: Record<string, Record<string, [number, number]>> = {};

function isNumber(charCode: number) {
	return charCode >= asciiNumberRange[0] && charCode <= asciiNumberRange[1];
}

function hasAdjacentSymbols(chunks: string[]) {
	let charCode: number = 0;
	for (let chunk of chunks) {
		for (let char of chunk) {
			charCode = char.charCodeAt(0);
			if (charCode === period || isNumber(charCode)) continue;
			return { valid: true, col: chunk.indexOf(char) };
		}
	}
	return { valid: false, col: undefined };
}

function trackAdjacentStars(input: string[], currentRow: number, col: number, found: number) {
	let rowBefore = currentRow - 1;
	let rowAfter = currentRow + 1;
	let starRow = '0';
	let starCol = col.toString();
	let check = false;
	if (rowBefore >= 0) {
		if (input[rowBefore][col] === '*') {
			starRow = rowBefore.toString();
			check = true;
		}
	}
	if (input[currentRow][col] === '*' && !check) {
		starRow = currentRow.toString();
		check = true;
	} else if (rowAfter < input.length && !check) {
		if (input[rowAfter][col] === '*') {
			starRow = rowAfter.toString();
			check = true;
		}
	}
	if (check) {
		if (adjacentStarsWithNumber[starRow] === undefined) {
			adjacentStarsWithNumber[starRow] = {};
			adjacentStarsWithNumber[starRow][starCol] = [found, 0];
		} else if (adjacentStarsWithNumber[starRow][starCol] === undefined) {
			adjacentStarsWithNumber[starRow][starCol] = [found, 0];
		} else {
			adjacentStarsWithNumber[starRow][starCol][1] = found;
		}
	}
}

function part1(input: string[]) {
	let final = 0;
	for (let i = 0; i < input.length; i++) {
		input[i] = input[i].trim();
		let isFirstLine = i === 0;
		let isLastLine = i === input.length - 1;
		let foundNumber = '';
		let chunks: string[] = [];
		for (let j = 0; j < input[i].length; j++) {
			let char = input[i][j].charCodeAt(0);
			let charIsNumber = isNumber(char);
			if (charIsNumber) foundNumber += input[i][j];
			let lastCharIsNum = charIsNumber && j == input[i].length - 1;
			if (lastCharIsNum || (!charIsNumber && foundNumber.length > 0)) {
				let start = Math.max(j - 1 - foundNumber.length, 0);
				let end = j + 1;
				if (!isFirstLine) {
					chunks.push(input[i - 1].substring(start, end));
				}
				chunks.push(input[i].substring(start, end));
				if (!isLastLine) {
					chunks.push(input[i + 1].substring(start, end));
				}
				let found = parseInt(foundNumber);
				let adjacentSymbol = hasAdjacentSymbols(chunks);
				if (adjacentSymbol.valid && adjacentSymbol.col !== undefined) {
					trackAdjacentStars(input, i, adjacentSymbol.col + start, found);
					final += found;
				}
				foundNumber = '';
				chunks = [];
			}
		}
	}
	return final;
}

function part2(input: string[]) {
	let final = 0;
	part1(input);
	for (let row of Object.keys(adjacentStarsWithNumber)) {
		for (let col of Object.keys(adjacentStarsWithNumber[row])) {
			let product = adjacentStarsWithNumber[row][col][0] * adjacentStarsWithNumber[row][col][1];
			final += product;
		}
	}
	return final;
}

let now = performance.now();
let answer1 = part1(input);
let elapsed = (performance.now() - now).toFixed(2);
console.log(`Result: ${answer1} in ${elapsed}ms`);
console.log('---------------------');
adjacentStarsWithNumber = {};
now = performance.now();
let answer2 = part2(input);
elapsed = (performance.now() - now).toFixed(2);
console.log(`Result: ${answer2} in ${elapsed}ms`);
