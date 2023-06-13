import Prompt from "prompts";

const gameInfo = await Prompt({
    type: "select",
    message: "Which mode do you wish to play?",

});
