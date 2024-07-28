
var api = Java.type('noppes.npcs.api.NpcAPI').Instance();

//Boiler

load(api.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/commonFunctions.js");
/**
 * @param {NpcEvent.MeleeAttackEvent} e
 */
function meleeAttack(e) {
    if (e.npc.getTimers().has(id("keep_target_held"))) return
    e.npc.getTimers().forceStart(id("keep_target_held"), 0, true)
    e.npc.getTimers().forceStart(id("release_target"), 160, false)
    e.npc.getAi().setWalkingSpeed(0)
}

function timer(e) {
    if (e.id == id("keep_target_held")) {
        if (!e.npc.getAttackTarget()) { e.npc.getTimers().stop(id("keep_target_held")); return }
        var d = FrontVectors(e.npc, 0, 0, 3, 1)
        e.npc.executeCommand("tp " + e.npc.getAttackTarget().name + " " + (e.npc.x + d[0]) + " " + e.npc.y + " " + (e.npc.z + d[2]))
    }
    if (e.id == id("release_target")) {
        e.npc.getTimers().stop(id("keep_target_held"))
        e.npc.getAi().setWalkingSpeed(5)
    }
}