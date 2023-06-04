export namespace Uno {
	type Color = "RED" | "BLUE" | "GREEN" | "YELLOW" | "UNIVERSAL";
	type Numbers = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
	type ColorActions = "SKIP" | "REVERSE" | "DRAW_TWO";
	type UniversalActions = "WILD" | "DRAW_FOUR";

	export interface NumberCard {
		color: Exclude<Color, "UNIVERSAL">;
		action: Numbers;
		arg: null;
	}

	export interface ColorActionCard {
		color: Exclude<Color, "UNIVERSAL">;
		action: ColorActions;
		arg: null;
	}

	export interface UniversalActionCard {
		color: "UNIVERSAL";
		action: UniversalActions;
		arg: Exclude<Color, "UNIVERSAL">;
	}

	export type Card = NumberCard | ColorActionCard | UniversalActionCard;
	export type Cards = Card[];
}
