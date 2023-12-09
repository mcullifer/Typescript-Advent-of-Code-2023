import fs from 'fs';
const test = fs
	.readFileSync('src/day5/test.txt', 'utf8')
	.split('\n')
	.filter((x) => x.charCodeAt(0) != 13)
	.map((x) => x.replace('\r', ''));
const input = fs
	.readFileSync('src/day5/input.txt', 'utf8')
	.split('\n')
	.filter((x) => x.charCodeAt(0) != 13)
	.map((x) => x.replace('\r', ''));

const enum MapIndex {
	DESTINATION,
	SOURCE,
	RANGE
}

function getMapValue(maps: number[][], valueToMap: number) {
	let mapInRange: number[] = [];
	maps = maps.sort((a, b) => a[MapIndex.SOURCE] - b[MapIndex.SOURCE]);
	for (let map of maps) {
		if (valueToMap < map[MapIndex.SOURCE]) break;
		if (
			map[MapIndex.SOURCE] == valueToMap ||
			map[MapIndex.SOURCE] + map[MapIndex.RANGE] > valueToMap
		) {
			mapInRange = map;
			break;
		}
	}
	if (mapInRange.length === 0) return valueToMap;
	let difference = mapInRange[MapIndex.SOURCE] - mapInRange[MapIndex.DESTINATION];
	let mappedValue = -1 * (difference - valueToMap);
	return mappedValue;
}

function getSectionStartIndexes(input: string[]) {
	let sectionStartIndexes: number[] = [];
	for (let i = 0; i < input.length; i++) {
		let firstChar = input[i][0].charCodeAt(0);
		if (firstChar < 48 || firstChar > 57) {
			sectionStartIndexes.push(i);
		}
	}
	sectionStartIndexes.push(input.length - 1);
	return sectionStartIndexes;
}

function toNumberArray(input: string) {
	let numStrings = input.split(' ');
	let nums = [];
	for (let numString of numStrings) {
		let num = parseInt(numString);
		if (!isNaN(num)) nums.push(num);
	}
	return nums;
}

function findLocation(input: string[], seed: number, startIndexes: number[]) {
	let maps: number[][] = [];
	let nextMapValue = seed;
	for (let i = 0; i < startIndexes.length - 1; i++) {
		maps = [];
		if (i + 1 > startIndexes.length) continue;
		for (let j = startIndexes[i] + 1; j <= startIndexes[i + 1]; j++) {
			maps.push(toNumberArray(input[j]));
		}
		nextMapValue = getMapValue(maps, nextMapValue);
	}
	return nextMapValue;
}

function part1(input: string[]) {
	let seeds = toNumberArray(input[0].substring(7));
	input = input.slice(1);
	let sectionStartIndexes = getSectionStartIndexes(input);
	let locations: number[] = [];
	for (let seed of seeds) {
		locations.push(findLocation(input, seed, sectionStartIndexes));
	}
	let min = Math.min(...locations);
	console.log('Min: ', Math.min(...seeds));
	console.log('Best seed: ', seeds[locations.indexOf(min)]);
	console.log('Max: ', Math.max(...seeds));
	return min;
}

/**
 * @description This is a brute force solution that works for the test input but not sure about the real input
 * I think it will eventually get the right answer but it will take a long time.
 * The real way to do this after looking at it seems to be:
 *
 * 1. Start from the end and find the minimum "destination" and the range of Source values that would map to it.
 * 2. Walk backwards to figure out the RANGE that the start seed should be in.
 * 3. Check if any of the seeds + the Range offset is within the starting range.
 * 4. You might be able to see if the max and min of this start range produces a bigger or smaller value, if so just take the min.
 */
function part2(input: string[]) {
	let seeds = toNumberArray(input[0].substring(7));
	input = input.slice(1);
	let sectionStartIndexes = getSectionStartIndexes(input);
	let locations = [];
	for (let i = 0; i < seeds.length; i += 2) {
		locations.push(findLocation(input, seeds[i], sectionStartIndexes));
	}
	let min = Math.min(...locations);
	let sortedSeeds = [...seeds];
	sortedSeeds.sort((a, b) => a - b);
	let minSeed = sortedSeeds[0];
	let middleSeed = sortedSeeds[Math.floor(sortedSeeds.length / 2)];
	let maxSeed = sortedSeeds[sortedSeeds.length - 1];
	let bestSeed = seeds[locations.indexOf(min)];
	console.log('Min: ', minSeed);
	console.log('Middle seed: ', middleSeed);
	console.log('Max: ', maxSeed);
	console.log('Best seed: ', bestSeed);
	let goBelowMin = bestSeed === minSeed;
	let goAboveMax = bestSeed === maxSeed;
	let goBelow = bestSeed < middleSeed;
	let goAbove = bestSeed >= middleSeed;
	for (let i = 1; i < seeds.length; i += 2) {
		if (goBelow) {
			if (seeds[i - 1] <= bestSeed) {
				let seedToUse = bestSeed - 1;
				let newLoc = findLocation(input, seedToUse, sectionStartIndexes);
				let newMinFound = false;
				while (seedToUse > seeds[i - 1]) {
					if (seedToUse == seeds[i - 1]) break;
					seedToUse = seedToUse - 1;
					newLoc = findLocation(input, seedToUse, sectionStartIndexes);
					if (newLoc < min) {
						bestSeed = seedToUse;
						min = newLoc;
						newMinFound = true;
					} else if (newMinFound) {
						break;
					}
				}
			}
		} else if (goAbove) {
			if (seeds[i - 1] + seeds[i] >= bestSeed) {
				let seedToUse = seeds[i - 1] + seeds[i];
				let newLoc = findLocation(input, seedToUse, sectionStartIndexes);
				let newMinFound = false;
				while (seedToUse > seeds[i - 1]) {
					if (seedToUse == seeds[i - 1]) break;
					seedToUse = seedToUse - 1;
					newLoc = findLocation(input, seedToUse, sectionStartIndexes);
					if (newLoc < min) {
						bestSeed = seedToUse;
						min = newLoc;
						newMinFound = true;
					} else if (newMinFound) {
						break;
					}
				}
			}
		}
	}
	console.log(bestSeed);
	return min;
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
