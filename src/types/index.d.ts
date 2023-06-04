export namespace Uno {
	type Color = "RED" | "BLUE" | "GREEN" | "YELLOW" | "UNIVERSAL";
	type Numbers = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
	type NumberActions = "SKIP" | "REVERSE" | "DRAW_TWO";
	type UniversalActions = "WILD" | "DRAW_FOUR";

	export interface NumberCard {
		color: Exclude<Color, "UNIVERSAL">;
		action: Numbers;
	}

	export interface ColorActionCard {
		color: Exclude<Color, "UNIVERSAL">;
		action: NumberActions;
	}

	export interface UniversalActionCard {
		color: "UNIVERSAL";
		action: UniversalActions;
	}

	export type Card = NumberCard | ColorActionCard | UniversalActionCard;
	export type Cards = Card[];
}
