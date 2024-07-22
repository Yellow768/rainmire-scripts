var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(API.getLevelDir() + "/scripts/ecmascript/boiler/commonFunctions.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");

function init(e) {
    e.npc.ai.setWalkingSpeed(10)
}

function target(e) {
    e.npc.timers.forceStart(id("choose_strafing"), 60, true)
}

function targetLost(e) {
    e.npc.timers.stop(id("choose_strafing"))
    e.npc.timers.stop(id("apply_strafing"))
    e.npc.setMoveStrafing(0)
}

var current_motion

function timer(e) {
    if (e.id == id("choose_strafing")) {
        var motion = [-10, 10]
        e.npc.setMoveStrafing(motion[getRandomInt(0, 1)])
    }

}


