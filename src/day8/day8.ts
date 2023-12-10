import fs from 'fs';
const test = fs
	.readFileSync('src/day8/test.txt', 'utf8')
	.split('\n')
	.map((x) => x.replace('\r', ''));
const test2 = fs
	.readFileSync('src/day8/test2.txt', 'utf8')
	.split('\n')
	.map((x) => x.replace('\r', ''));
const input = fs
	.readFileSync('src/day8/input.txt', 'utf8')
	.split('\n')
	.map((x) => x.replace('\r', ''));

let nodes = new Map<string, [string, string]>();
let directions = '';
let startKeys: string[] = [];
let endKeys: string[] = [];
let foundKeyForIndex: number[] = [];

function setup(input: string[]) {
	nodes = new Map<string, [string, string]>();
	startKeys = [];
	endKeys = [];
	for (let line of input) {
		let split = line.split(' = ');
		let key = split[0];
		if (key.endsWith('A')) {
			startKeys.push(key);
		} else if (key.endsWith('Z')) {
			endKeys.push(key);
		}
		let value = split[1].substring(1, split[1].length - 1);
		let LR = value.split(', ');
		nodes.set(key, [LR[0], LR[1]]);
	}
}

function walkRecursive(
	startKey: string,
	directions: string,
	nodes: Map<string, [string, string]>
): number {
	let nodeKey = startKey;
	let steps = 0;
	let zFound = false;
	for (let i = 0; i < directions.length; i++) {
		steps++;
		let direction = directions[i] == 'L' ? 0 : 1;
		nodeKey = nodes.get(nodeKey)?.[direction] ?? nodeKey;
		if (nodeKey === 'ZZZ') {
			zFound = true;
			break;
		}
	}
	if (!zFound) {
		return steps + walkRecursive(nodeKey, directions, nodes);
	}
	return steps;
}

function walkInParallel(currentKeys: string[], direction: 0 | 1, step: number) {
	let zFound = 0;
	for (let j = 0; j < startKeys.length; j++) {
		currentKeys[j] = nodes.get(currentKeys[j])?.[direction] ?? currentKeys[j];
		if (endKeys.includes(currentKeys[j])) {
			foundKeyForIndex[j] += step;
			zFound++;
		}
	}
}

/**
 * @link [Euclidean Algorithm](https://en.wikipedia.org/wiki/Greatest_common_divisor#Euclidean_algorithm)
 */
function GCD(a: number, b: number): number {
	if (b === 0) return a;
	return GCD(b, a % b);
}

/**
 * @link [Least Common Multiple](https://en.wikipedia.org/wiki/Greatest_common_divisor#Least_common_multiple)
 */
function LCM(a: number, b: number): number {
	return (a * b) / GCD(a, b);
}

function findLeastCommonMultiple(numbers: number[]) {
	return numbers.reduce(LCM);
}

function part1(input: string[]) {
	directions = input[0];
	input = input.slice(2);
	setup(input);
	let steps = walkRecursive('AAA', directions, nodes);
	return steps;
}

function part2(input: string[]) {
	directions = input[0];
	input = input.slice(2);
	setup(input);
	let steps = 0;
	let zFound = false;
	foundKeyForIndex = new Array(startKeys.length).fill(0);
	while (!zFound) {
		for (let i = 0; i < directions.length; i++) {
			if (zFound) {
				break;
			}
			steps++;
			walkInParallel(startKeys, directions[i] == 'L' ? 0 : 1, steps);
			if (foundKeyForIndex.every((x) => x > 0)) {
				zFound = true;
			}
		}
	}
	let lcm = findLeastCommonMultiple(foundKeyForIndex);
	return lcm;
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

//Part 1 Test
// LLR;

// AAA = (BBB, BBB);
// BBB = (AAA, ZZZ);
// ZZZ = (ZZZ, ZZZ);

// Part 2 Test
// LR

// 11A = (11B, XXX)
// 11B = (XXX, 11Z)
// 11Z = (11B, XXX)
// 22A = (22B, XXX)
// 22B = (22C, 22C)
// 22C = (22Z, 22Z)
// 22Z = (22B, 22B)
// XXX = (XXX, XXX)
