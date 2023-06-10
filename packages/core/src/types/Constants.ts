import type { Uno } from "packages/src/types/index";

export const UnoColors = ["RED", "BLUE", "GREEN", "YELLOW"] as const;
export const UnoActions = ["SKIP", "REVERSE", "DRAW_TWO"] as const;
export const UnoUniversalActions = ["WILD", "DRAW_FOUR"] as const;

export const UnoNumberCards: Record<`${Uno.Color}_${Uno.Numbers}`, Uno.NumberCard> = Object.fromEntries(
	UnoColors.map((col) =>
		Array.from({ length: 10 }, (_, i) => [`${col}_${i}`, { color: col, action: i.toString(), asset: `./assets/${col}/${i}.png` }]),
	).flat(),
);
export const UnoNumberCardsArray = Object.values(UnoNumberCards);

export const UnoColorActionCards: Record<`${Uno.Color}_${Uno.ColorActions}`, Uno.ColorActionCard> = Object.fromEntries(
	UnoColors.map((col) => UnoActions.map((act) => [`${col}_${act}`, { color: col, action: act, asset: `./assets/${col}/${act}.png` }])).flat(),
);
export const UnoColorActionCardsArray = Object.values(UnoColorActionCards);

export const UnoUniversalActionCards: Record<`UNIVERSAL_${Uno.UniversalActionCard["action"]}`, Uno.UniversalActionCard> = Object.fromEntries(
	UnoUniversalActions.map((x) => [`UNIVERSAL_${x}`, { color: "UNIVERSAL", action: x, asset: `./assets/UNIVERSAL/${x}.png` }]),
) as any;
export const UnoUniversalActionCardsArray = Object.values(UnoUniversalActionCards);

export const UnoActionCards = { ...UnoColorActionCards, ...UnoUniversalActionCards };
export const AllUnoCards = { ...UnoNumberCards, ...UnoActionCards };

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
