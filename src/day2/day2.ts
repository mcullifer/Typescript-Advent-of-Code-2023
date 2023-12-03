import fs from 'fs';
const test = fs.readFileSync('src/day2/test.txt', 'utf8').split('\n');
const input = fs.readFileSync('src/day2/input.txt', 'utf8').split('\n');

function part1(input: string[]) {
	let final = 0;
	for (let i = 0; i < input.length; i++) {
		let gameSplit = input[i].split(':');
		let gameNumber = parseInt(gameSplit[0].substring(5));
		let results = gameSplit[1].substring(1).replace('\r', '');
		let rounds = results.split('; ');
		let skip = false;
		let maxValues: Record<string, number> = {
			red: 12,
			green: 13,
			blue: 14
		};
		for (let j = 0; j < rounds.length; j++) {
			let colorPairs = rounds[j].split(', ');
			for (let k = 0; k < colorPairs.length; k++) {
				let colorValue = colorPairs[k].split(' ');
				let value = parseInt(colorValue[0]);
				let color = colorValue[1];
				if (maxValues[color] < value) {
					skip = true;
					break;
				}
			}
			if (skip) break;
		}
		if (!skip) {
			final += gameNumber;
		}
	}
	return final;
}

function part2(input: string[]) {
	let final = 0;
	for (let i = 0; i < input.length; i++) {
		let gameSplit = input[i].split(': ');
		let results = gameSplit[1].replace('\r', '');
		let rounds = results.split('; ');
		let maxValues: Record<string, number> = {
			red: 1,
			green: 1,
			blue: 1
		};
		for (let j = 0; j < rounds.length; j++) {
			let colorPairs = rounds[j].split(', ');
			for (let k = 0; k < colorPairs.length; k++) {
				let colorValue = colorPairs[k].split(' ');
				let value = parseInt(colorValue[0]);
				let color = colorValue[1];
				if (maxValues[color] < value) maxValues[color] = value;
			}
		}
		final += maxValues.red * maxValues.green * maxValues.blue;
	}
	return final;
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
