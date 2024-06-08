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

function FrontVectors(entity, dr, dp, distance, mode) {
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



function DoKnockback(npc, targ, kb, kbVert) {
    targ.setMotionY(kbVert)
    if (kb < 1) {
        var d = FrontVectors(npc, GetPlayerRotation(npc, targ), 0, kb, 0)
        targ.setMotionX(d[0])
        targ.setMotionZ(d[2])
        return;
    }
    targ.knockback(kb, GetPlayerRotation(npc, targ))
}


function TrueDistanceCoord(x1, y1, z1, x2, y2, z2) {

    var dx = x1 - x2

    var dy = y1 - y2

    var dz = z1 - z2

    var R = Math.pow((dx * dx + dy * dy + dz * dz), 0.5)

    return R;
}

function GetPlayerRotation(npc, player) {

    var dx = npc.getX() - player.getX();

    var dz = player.getZ() - npc.getZ();

    if (dz >= 0) {

        var angle = (Math.atan(dx / dz) * 180 / Math.PI);

        if (angle < 0) {

            angle = 360 + angle;
        }
    }

    if (dz < 0) {

        dz = -dz;

        var angle = 180 - (Math.atan(dx / dz) * 180 / Math.PI);
    }

    return angle;
}

function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}


function pp(e, message) {
    e.player.message(message)
}