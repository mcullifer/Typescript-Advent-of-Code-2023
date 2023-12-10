import fs from 'fs';
const test = fs
	.readFileSync('src/day7/test.txt', 'utf8')
	.split('\n')
	.map((x) => x.replace('\r', ''));
const input = fs
	.readFileSync('src/day7/input.txt', 'utf8')
	.split('\n')
	.map((x) => x.replace('\r', ''));

const enum HandType {
	HIGH_CARD = 1,
	ONE_PAIR = 2,
	TWO_PAIR = 3,
	THREE_OF_A_KIND = 4,
	FULL_HOUSE = 5,
	FOUR_OF_A_KIND = 6,
	FIVE_OF_A_KIND = 7
}

const valueOfCard: Record<string, number> = {
	'2': 2,
	'3': 3,
	'4': 4,
	'5': 5,
	'6': 6,
	'7': 7,
	'8': 8,
	'9': 9,
	T: 10,
	J: 11,
	Q: 12,
	K: 13,
	A: 14
};

type Hand = {
	type: HandType;
	cards: string;
	bid: number;
};

function sortHands(hands: Hand[]) {
	return hands.sort((a, b) => {
		let bigger = b.type - a.type;
		if (bigger === 0) {
			let index = 0;
			while (true) {
				if (valueOfCard[b.cards[index]] - valueOfCard[a.cards[index]] == 0) {
					index++;
				} else {
					break;
				}
			}
			return valueOfCard[b.cards[index]] - valueOfCard[a.cards[index]];
		} else {
			return bigger;
		}
	});
}

function checkHandType(cards: string) {
	let counts: Record<string, number> = {};
	for (let card of cards) {
		if (counts[card]) {
			counts[card]++;
		} else {
			counts[card] = 1;
		}
	}
	let uniqueCount = Object.keys(counts).length;
	let allMatch = uniqueCount === 1 && Object.values(counts)[0] === 5;
	let fourMatch = uniqueCount === 2 && Object.values(counts).includes(4);
	let threeMatch = uniqueCount >= 2 && Object.values(counts).includes(3);
	let twoMatch = Object.values(counts).includes(2);
	if (allMatch) return HandType.FIVE_OF_A_KIND;
	if (fourMatch) return HandType.FOUR_OF_A_KIND;
	if (threeMatch && twoMatch) {
		return HandType.FULL_HOUSE;
	} else if (threeMatch) {
		return HandType.THREE_OF_A_KIND;
	}
	if (twoMatch) {
		let pairCount = Object.values(counts).filter((x) => x === 2).length;
		if (pairCount === 2) {
			return HandType.TWO_PAIR;
		} else {
			return HandType.ONE_PAIR;
		}
	}
	return HandType.HIGH_CARD;
}

function getHandTypeWithWildcard(cards: string) {
	let altCards = '';
	let counts: Record<string, number> = {};
	for (let card of cards) {
		if (counts[card]) {
			counts[card]++;
		} else {
			counts[card] = 1;
		}
	}
	let uniqueCards = Object.keys(counts);
	let uniqueCount = Object.keys(counts).length;
	let allMatch = uniqueCount === 1 && Object.values(counts)[0] === 5;
	let fourMatch = uniqueCount === 2 && Object.values(counts).includes(4);
	let threeMatch = uniqueCount >= 2 && Object.values(counts).includes(3);
	let twoMatch = Object.values(counts).includes(2);
	let oneMatch = Object.values(counts).includes(1) && uniqueCount === 5;
	let highestCard = uniqueCards
		.filter((x) => x != 'J')
		.sort((a, b) => valueOfCard[b] - valueOfCard[a])[0];
	if (allMatch) {
		if (counts['J']) {
			altCards = cards.replaceAll('J', 'A');
			return checkHandType(altCards);
		}
	}
	if (fourMatch) {
		let matchTo = uniqueCards.find((x) => counts[x] === 4);
		if (counts['J'] == 4) {
			altCards = cards.replaceAll('J', highestCard);
		} else if (matchTo) {
			altCards = cards.replace('J', matchTo);
		}
		return checkHandType(altCards);
	}
	if (threeMatch && twoMatch) {
		if (counts['J']) {
			let matchTo = uniqueCards.find((x) => counts[x] === 5 - counts['J']);
			if (matchTo) {
				altCards = cards.replaceAll('J', matchTo);
			}
		}
		return checkHandType(altCards);
	} else if (threeMatch) {
		let matchTo = uniqueCards.find((x) => counts[x] === 3);
		if (counts['J'] == 3) {
			altCards = cards.replaceAll('J', highestCard);
		} else if (counts['J'] && matchTo) {
			altCards = cards.replaceAll('J', matchTo);
		}
		return checkHandType(altCards);
	}
	if (twoMatch) {
		let pairCount = Object.values(counts).filter((x) => x === 2).length;
		let matchTo = uniqueCards
			.filter((x) => counts[x] === 2)
			.sort((a, b) => valueOfCard[b] - valueOfCard[a])[0];
		if (pairCount === 2) {
			if (matchTo !== 'J') {
				altCards = cards.replaceAll('J', matchTo);
			}
		} else {
			if (counts['J'] == 2) {
				altCards = cards.replaceAll('J', highestCard);
			} else {
				altCards = cards.replaceAll('J', matchTo);
			}
		}
		return checkHandType(altCards);
	}
	if (oneMatch) {
		altCards = cards.replace('J', highestCard);
	}
	return checkHandType(altCards);
}

function part1(input: string[]) {
	let hands: Hand[] = [];
	for (let line of input) {
		let split = line.split(' ');
		let cards = split[0];
		let bid = parseInt(split[1]);
		let hand: Hand = {
			type: checkHandType(cards),
			cards: cards,
			bid: bid
		};
		hands.push(hand);
	}
	let sortedHands = sortHands(hands);
	let winnings = 0;
	for (let i = 0; i < sortedHands.length; i++) {
		winnings += sortedHands[i].bid * (sortedHands.length - i);
	}
	return winnings;
}

function part2(input: string[]) {
	let hands: Hand[] = [];
	valueOfCard['J'] = 1;
	for (let line of input) {
		let split = line.split(' ');
		let cards = split[0];
		let bid = parseInt(split[1]);
		let type = HandType.HIGH_CARD;
		if (cards.includes('J')) {
			type = getHandTypeWithWildcard(cards);
		} else {
			type = checkHandType(cards);
		}
		let hand: Hand = {
			type: type,
			cards: cards,
			bid: bid
		};
		hands.push(hand);
	}
	let sortedHands = sortHands(hands);
	let winnings = 0;
	for (let i = 0; i < sortedHands.length; i++) {
		winnings += sortedHands[i].bid * (sortedHands.length - i);
	}
	return winnings;
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
