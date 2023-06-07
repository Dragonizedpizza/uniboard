import { EventEmitter } from "node:events";
import { generateUnoDeck } from "../types/Constants.js";
import type { Uno } from "#types";

export class UnoEngine<Names extends string[]> extends EventEmitter {
	public hands = {} as Record<Names[number], Uno.Cards>;
	public deck = generateUnoDeck();
	public names: Names;
	public positions: [Names[number], number][] = [];
	public currentChance: Names[number];
	public currentCard!: Uno.Card;

	constructor(...names: Names) {
		super();

		this.names = names;

		this.names.forEach((name: Names[number]) => {
			this.hands[name] = [];
		});

		this.currentChance = this.names[Math.floor(Math.random() * this.names.length)];
		this.dealCards();
	}

	public start() {
		this.dealCards();
		this.emit("nextChance", this.currentChance);
	}

	public dealCards() {
		this.names.forEach((name: Names[number]) => {
			this.hands[name] = this.deck.splice(0, 7);
		});

		this.currentCard = this.deck.shift()!;
		this.emit("card", this.currentCard);
	}

	public drawCard(name: Names[number], amount: number = 1) {
		for (let i = 0; i < amount; i++) {
			const card = this.deck.shift();
			if (!card) {
				const positions = Object.entries(this.hands).sort((a: [string, any], b: [string, any]) => b[1].length - a[1].length);

				return this.emit("gameEnd", this.positions.push(...(positions as any)));
			}
			this.hands[name].push(card);
		}
	}

	public playCard(card: Uno.Card) {
		if (!this.isPlayable(card)) throw new Error("This card is not playable!");
		this.hands[this.currentChance].splice(
			this.hands[this.currentChance].findIndex((c) => card.color === c.color && card.action === c.action),
			1,
		);

		let skip = false;

		if (card.color === "UNIVERSAL") {
			card.color = card.arg as any;

			if (card.action === "DRAW_FOUR") {
				const next = this.getNextChance();
				this.emit("drawn", this.currentChance, next, 4);

				this.drawCard(next, 4);
				skip = true;
			}
		} else if (card.action === "DRAW_TWO") {
			const next = this.getNextChance();
			this.emit("drawn", this.currentChance, next, 2);

			this.drawCard(next, 2);
			skip = true;
		} else if (card.action === "SKIP") {
			this.emit("skipped", this.currentChance, this.getNextChance());
			skip = true;
		} else if (card.action === "REVERSE") {
			this.names.reverse();
			this.emit("reversed", this.currentChance, this.getNextChance());
		}

		this.currentCard = card;
		this.nextChance(skip);
	}

	public isPlayable(card: Uno.Card) {
		return (
			card.action === this.currentCard.action ||
			card.color === this.currentCard.color ||
			card.color === "UNIVERSAL" ||
			this.currentCard.color === "UNIVERSAL"
		);
	}

	public getNextChance(skip: boolean = false) {
		const index = this.names.indexOf(this.currentChance);
		return this.names[index + (skip ? 2 : 1)] ?? this.names[index + (skip ? 2 : 1) - this.names.length];
	}

	public nextChance(skip: boolean = false) {
		if (this.hands[this.currentChance].length === 0) {
			this.positions.push([this.currentChance, 0]);

			delete this.hands[this.currentChance];
			this.names.splice(this.names.indexOf(this.currentChance), 1);

			this.emit("win", this.currentChance);
			if (this.names.length > 1) {
				this.currentChance = this.getNextChance(skip);
				this.emit("nextChance", this.currentChance);
			} else this.emit("gameEnd", this.positions);
		} else {
			this.currentChance = this.getNextChance(skip);
			this.emit("nextChance", this.currentChance);
		}
	}
}
