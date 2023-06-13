import { UnoEngine } from "../struct/UnoEngine.js";

export namespace Uno {
	export type Colors = "RED" | "BLUE" | "GREEN" | "YELLOW";
	export type AllColors = Colors | "UNIVERSAL";
	export type Numbers = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
	export type ColorActions = "SKIP" | "REVERSE" | "DRAW_TWO";
	export type UniversalActions = "WILD" | "DRAW_FOUR";
	export type AllActions = Numbers | ColorActions | UniversalActions;

	export interface NumberCard {
		color: Colors;
		action: Numbers;
		asset: string;
		arg: null;
	}

	export interface ColorActionCard {
		color: Colors;
		action: ColorActions;
		asset: string;
		arg: null;
	}

	export interface UniversalActionCard {
		color: "UNIVERSAL";
		action: UniversalActions;
		asset: string;
		arg: Colors;
	}

	export type Card = NumberCard | ColorActionCard | UniversalActionCard;
	export type Cards = Card[];

	export const Colors = ["RED", "BLUE", "GREEN", "YELLOW"] as const;
	export const AllColors = ["RED", "BLUE", "GREEN", "YELLOW", "UNIVERSAL"] as const;
	export const Actions = ["SKIP", "REVERSE", "DRAW_TWO"] as const;
	export const UniversalActions = ["WILD", "DRAW_FOUR"] as const;

	export const NumberCards: Record<`${Colors}_${Numbers}`, NumberCard> = Object.fromEntries(
		Colors.map((col) =>
			Array.from({ length: 10 }, (_, i) => [`${col}_${i}`, { color: col, action: i.toString(), asset: `./assets/${col}/${i}.png` }]),
		).flat(),
	) as any;
	export const NumberCardsArray = Object.values(NumberCards);

	export const ColorActionCards: Record<`${Colors}_${ColorActions}`, ColorActionCard> = Object.fromEntries(
		Colors.map((col) => Actions.map((act) => [`${col}_${act}`, { color: col, action: act, asset: `./assets/${col}/${act}.png` }])).flat(),
	) as any;
	export const ColorActionCardsArray = Object.values(ColorActionCards);

	export const UniversalActionCards: Record<`UNIVERSAL_${UniversalActions}`, UniversalActionCard> = Object.fromEntries(
		UniversalActions.map((x) => [`UNIVERSAL_${x}`, { color: "UNIVERSAL", action: x, asset: `./assets/UNIVERSAL/${x}.png` }]),
	) as any;
	export const UniversalActionCardsArray = Object.values(UniversalActionCards);

	export const ActionCards = { ...ColorActionCards, ...UniversalActionCards };
	export const AllCards = { ...NumberCards, ...ActionCards };

	export const Deck = (<Card[]>Object.values(NumberCardsArray)).concat(
		NumberCardsArray.filter((card) => card.action !== "0"),
		ColorActionCardsArray,
		ColorActionCardsArray,
		UniversalActionCardsArray,
		UniversalActionCardsArray,
		UniversalActionCardsArray,
		UniversalActionCardsArray,
	);

	export function generateDeck() {
		const cards = Deck.slice();

		for (let i = cards.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[cards[i], cards[j]] = [cards[j], cards[i]];
		}

		return cards as Cards;
	}

	export const Engine = UnoEngine;
}
