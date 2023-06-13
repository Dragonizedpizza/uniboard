import { resolve } from "path";
import { Uno } from "@boardmaster/core";

function startsWith(string: string, ...strings: string[]): boolean {
	return strings.some((s) => string.startsWith(s));
}

export namespace Uno {
	export function resolveCardPath({ color, action }: { color: Uno.AllColors; action: Uno.AllActions }): string;
	export function resolveCardPath({ path }: { path: string }): string;
	export function resolveCardPath({ card }: { card: keyof Uno.AllCards }): string;
	export function resolveCardPath({
		color,
		action,
		path,
		card,
	}: {
		color?: Uno.AllColors;
		action?: Uno.AllActions;
		path?: string;
		card?: keyof Uno.AllCards;
	}): string {
		if (path) {
			if (startsWith(path, "./assets", "assets")) return resolve(new URL(".", import.meta.url).pathname, path);
			else if (startsWith(path, "./UNO", "UNO")) return resolve(new URL(".", import.meta.url).pathname, "./assets/", path);
			else if (startsWith(path, ...Uno.AllColors.map((x) => [x, `./${x}`]).flat()))
				return resolve(new URL(".", import.meta.url).pathname, "./assets/UNO/", path);
			else throw new Error("Invalid path provided.");
		} else if (card) {
			const card = Uno.AllCards[card];
			if (!card) throw new Error("Invalid card provided.");
			else return resolve(new URL(".", import.meta.url).pathname, "./assets/UNO/", card.color, card.action);
		} else {
			if (!Uno.AllCards[`${color}_${action}`]) throw new Error("Invalid card provided.");
			else return resolve(new URL(".", import.meta.url).pathname, "./assets/UNO/", color, action);
		}
	}
}
