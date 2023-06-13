import { Uno } from "@boardmaster/core";
import { WebSocket } from "ws";
import { resolve } from "path";
import Axios from "axios";
import TerminalImage from "terminal-image";
import Prompt from "promots";
import casePkg from "case";

const { title } = casePkg,
    { file: printFile } = TerminalImage;

const gameInfo = await Prompt([{
    type: "select",
    name: "game",
    message: "Which game do you want to play?",
    choices: [{
        name: "uno",
        value: "uno",
    }]
}]);
