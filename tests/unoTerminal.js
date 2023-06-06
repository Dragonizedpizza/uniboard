import { UnoEngine } from "../dist/struct/UnoEngine.js";
import { AllUnoCards } from "../dist/types/Constants.js";
import { resolve } from "path";
import casePkg from "case";
import TerminalImage from "terminal-image";
import prompt from "prompts";

function convertCard(card) {
	return title(`${card.color.includes("UNIVERSAL") ? card.color.replace("UNIVERSAL", card.arg || "") : card.color + "_"}${card.action}`);
}

const uno = new UnoEngine("Player 1", "Player 2"),
	{ file: termFile } = TerminalImage,
	{ title } = casePkg;

let first = true;

uno.on("card", async (card, by) => {
	if (by) console.log(`${convertCard(card)} was played by ${by}.`);
	else { console.log(`The first card is ${convertCard(card)}.`); first = false; };
});

uno.on("drawn", (by, to, amount) => {
	if (!to) console.log(`${by} drew a card.`);
	else console.log(`${to} was made to draw ${amount} cards by ${by}.`);
});

uno.emit("skipped", (by, to) => {
	console.log(`${to}'s turn was skipped by ${by}.`);
});

uno.on("reversed", (by, to) => {
	console.log(`${to}'s turn was reversed by ${by}.`);
});

uno.on("nextChance", async (player) => {
	console.log(await termFile(resolve(new URL('.', import.meta.url).pathname, `../assets/${["WILD", "DRAW_FOUR"].includes(uno.currentCard.action) ? "UNIVERSAL" : uno.currentCard.color}`, `${uno.currentCard.action}.png`)));
	if (!first) console.log(`The current card is a ${convertCard(uno.currentCard)}.`);

	console.log(`It's ${player}'s chance.`);

	const response = await prompt(
		[{
			type: "select",
			name: "card",
			message: "Select a card to play.",
			hint: `- You have a total of ${uno.hands[player].length} cards. Use arrow-keys to select, return to submit.`,
			choices: [{ title: "Draw a card", value: "DRAW_CARD" }].concat(
				uno.hands[player]
					.sort((card, otherCard) => Number(uno.isPlayable(otherCard)) - Number(uno.isPlayable(card)))
					.map((card) => ({
						title: convertCard(card),
						value: `${card.color}_${card.action}`,
						disabled: !uno.isPlayable(card),
					})),
			),
		},
		{
			type: (prev) => (prev.includes("UNIVERSAL") ? "select" : null),
			name: "arg",
			message: "Select the color you want to change to.",
			choices: ["RED", "BLUE", "GREEN", "YELLOW"].map((color) => ({
				title: title(color),
				value: color,
			})),
		}],
	);

	if (!response.card) return;

	if (response.card === "DRAW_CARD") {
		uno.drawCard(player);
		console.log("You drew a card.");
		uno.nextChance();
	} else {
		const card = Object.assign({}, AllUnoCards[response.card]);
		if (response.arg) card.arg = response.arg;

		console.log(`You played a ${convertCard(card)}.`);
		uno.playCard(card);
	}
});

uno.start();
