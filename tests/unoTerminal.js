import { UnoEngine } from "../dist/struct/UnoEngine.js";
import casePkg from "case";
import TerminalImage from "terminal-image";
import prompt from "prompts";

function convertCard(card) {
	return title(`${card.color.includes("UNIVERSAL") ? card.color.replace("UNIVERSAL", "") : card.color + "_"}${card.action}`);
}

function splitOnce(s, on) {
	const [first, ...rest] = s.split(on);
	return [first, rest.length > 0 ? rest.join(on) : null];
}

const uno = new UnoEngine("Player 1", "Player 2"),
	{ file: termFile } = TerminalImage,
	{ title } = casePkg;

let imgResolve,
	imgNotPrinted = new Promise((resolve) => (imgResolve = resolve));

uno.on("card", async (card, by) => {
	if (by) console.log(`${convertCard(card)} was played by ${by}.`);
	else console.log(`The first card is ${convertCard(card)}.`);
	console.log(await termFile(`./assets/${card.color}/${card.action}.png`));
	imgResolve(false);
	imgNotPrinted = new Promise((resolve) => (imgResolve = resolve));
});

uno.on("drawn", (by, to, amount) => {
	if (!to) console.log(`${by} drew a card.`);
	else console.log(`${to} was made to draw ${amount} cards by ${by}.`);
});

uno.emit("skip", (by, to) => {
	console.log(`${to}'s turn was skipped by ${by}.`);
});

uno.on("nextChance", async (player) => {
	if (imgNotPrinted) await imgNotPrinted;

	console.log(`It's ${player}'s chance.`);

	const response = await prompt(
		{
			type: "select",
			name: "card",
			message: "Select a card to play.",
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
			type: (prev) => (prev.startsWith("UNIVERSAL") ? "select" : null),
			name: "arg",
			message: "Select the color you want to change to.",
			choices: ["RED", "BLUE", "GREEN", "YELLOW"].map((color) => ({
				title: title(color),
				value: color,
			})),
		},
	);

	if (response.card === "DRAW_CARD") {
		uno.drawCard(player);
		console.log("You drew a card.");
		uno.nextChance();
	} else {
		const cardData = splitOnce(response.card, "_"),
			card = {
				color: cardData[0],
				action: cardData[1],
				arg: response.arg || null,
			};

		uno.playCard(card);
	}
});

uno.start();
