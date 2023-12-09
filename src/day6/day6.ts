import fs from 'fs';
const test = fs.readFileSync('src/day6/test.txt', 'utf8').split('\n');
const input = fs.readFileSync('src/day6/input.txt', 'utf8').split('\n');

function parseInputWithSpaces(input: string[]) {
	let result: number[][] = [];
	for (let line of input) {
		let parsed = line.match(/\d+/g)?.map(Number);
		if (parsed) result.push(parsed);
	}
	result = result[0].map((_, colIndex) => result.map((row) => row[colIndex]));
	return result;
}

function parseInputWithoutSpace(input: string[]) {
	let result: number[] = [];
	for (let line of input) {
		let num = parseInt(line.replace(/[^\d.-]+/g, ''));
		if (!isNaN(num)) result.push(num);
	}
	return result;
}

function quadraticSolutions(b: number, c: number) {
	let result: number[] = [];
	let discriminant = b * b - 4 * c;
	if (discriminant < 0) {
		return result;
	} else if (discriminant === 0) {
		result.push(Math.round(b / 2));
		return result;
	} else {
		let sqrt = Math.sqrt(discriminant);
		let lowerBound = Math.abs(-b + sqrt);
		let upperBound = Math.abs(-b - sqrt);
		result.push(Math.ceil(lowerBound / 2));
		result.push(Math.floor(upperBound / 2));
		return result;
	}
}

function part1(input: string[]) {
	let races = parseInputWithSpaces(input);
	let result = 1;
	for (let race of races) {
		let maxTime = race[0];
		let requiredDistance = race[1];
		let sol = quadraticSolutions(maxTime, requiredDistance + 1);
		result *= sol[1] - sol[0] + 1;
	}
	return result;
}

function part2(input: string[]) {
	let races = parseInputWithoutSpace(input);
	let maxTime = races[0];
	let requiredDistance = races[1];
	let sol = quadraticSolutions(maxTime, requiredDistance + 1);
	let result = sol[1] - sol[0] + 1;
	return result;
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
