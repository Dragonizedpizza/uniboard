import { EventEmitter } from "node:events";
import { generateUnoDeck } from "../types/Constants";
import type { Uno } from "#types";


export class UnoEngine<Names extends string[]> extends EventEmitter {
	public hands = {} as Record<Names[number], Uno.Cards>;
	public deck = generateUnoDeck();
	public usedCards: Uno.Cards = [];

	constructor(public names: Names) {
		super();

		this.names.forEach((name: Names[number]) => {
			this.hands[name] = [];
		});

	}
}
