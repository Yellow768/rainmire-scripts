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

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min; // The maximum is exclusive and the minimum is inclusive
}

function frontVectors(entity, dr, dp, distance, mode) {
    if (!mode) mode = 0
    if (mode == 1) { var angle = dr + entity.getRotation(); var pitch = (-entity.getPitch() + dp) * Math.PI / 180; if (dp == 0) pitch = 0; }
    if (mode == 0) { var angle = dr; var pitch = (dp) * Math.PI / 180 }
    var dx = -Math.sin(angle * Math.PI / 180) * (distance * Math.cos(pitch))
    var dy = Math.sin(pitch) * distance
    var dz = Math.cos(angle * Math.PI / 180) * (distance * Math.cos(pitch))
    return [dx, dy, dz]
}

function dataGet(entity, key) {
    return entity.storeddata.get(key)
}

function dataPut(entity, key, value) {
    entity.storeddata.put(key, value)
}

function tempGet(entity, key) {
    return entity.tempdata.get(key)
}

function tempPut(entity, key, value) {
    entity.tempdata.put(key, value)
}