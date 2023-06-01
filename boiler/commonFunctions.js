var API = Java.type('noppes.npcs.api.NpcAPI').Instance();

function executeCommand(command) {
    return API.executeCommand(API.getIWorld("overworld"), command)
}

function doesStringContainPhrase(string, phrase) {
    if (string.indexOf(phrase) == -1) { return false }
    else { return true }
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}