import type { Uno } from "#types";

export const UnoColors = ["RED", "BLUE", "GREEN", "YELLOW"] as const;
export const UnoActions = ["SKIP", "REVERSE", "DRAW_TWO"] as const;
export const UnoUniversalActions = ["WILD", "DRAW_FOUR"] as const;

export const UnoNumberCards: Record<`${Uno.Color}_${Uno.NumberCard["action"]}`, Uno.NumberCard> = Object.fromEntries(
	UnoColors.map((col) => Array.from({ length: 10 }, (_, i) => [`${col}_${i}`, { color: col, action: i.toString() }])).flat(),
);
export const UnoNumberCardsArray = Object.values(UnoNumberCards);

export const UnoColorActionCards: Record<`${Uno.Color}_${Uno.NumberActions}`, Uno.ColorActionCard> = Object.fromEntries(
	UnoColors.map((col) => UnoActions.map((act) => [`${col}_${act}`, { color: col, action: act }])).flat(),
);
export const UnoColorActionCardsArray = Object.values(UnoColorActionCards);

export const UnoUniversalActionCards: Record<`UNIVERSAL_${Uno.UniversalActionCard["action"]}`, Uno.UniversalActionCard> = Object.fromEntries(
	UnoUniversalActions.map((x) => [`UNIVERSAL_${x}`, { color: "UNIVERSAL", action: x }]),
) as any;
export const UnoUniversalActionCardsArray = Object.values(UnoUniversalActionCards);

export const ActionCards = { ...UnoColorActionCards, ...UnoUniversalActionCards };
export function getAllUnoCards() {
	return { ...UnoNumberCards, ...ActionCards };
}
export const UnoDeck = (<Uno.Card[]>Object.values(UnoNumberCardsArray)).concat(
	UnoNumberCardsArray.filter((card) => card.action !== "0"),
	UnoColorActionCardsArray,
	UnoColorActionCardsArray,
	UnoUniversalActionCardsArray,
	UnoUniversalActionCardsArray,
	UnoUniversalActionCardsArray,
	UnoUniversalActionCardsArray,
);

export function generateUnoDeck() {
	const cards = UnoDeck.slice();

	for (let i = cards.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[cards[i], cards[j]] = [cards[j], cards[i]];
	}

	return cards as Uno.Cards;
}
