var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/base_npc_script.js')
state_idle.target = function (e) {
    e.npc.timers.forceStart(1, getRandomInt(20, 60), false)
}

state_idle.targetLost = function (e) {
    e.npc.timers.stop(1)
    e.npc.ai.setWalkingSpeed(6)
}

state_idle.died = function (e) {
    e.npc.timers.stop(1)
    e.npc.timers.stop(2)
    e.npc.ai.setWalkingSpeed(6)
}

state_idle.timer = function (e) {
    if (e.id == 1) {
        e.npc.timers.forceStart(2, 10, false)
        e.npc.ai.setWalkingSpeed(0)
    }
    if (e.id == 2 && e.npc.getAttackTarget() != null) {
        e.npc.executeCommand("/particle minecraft:poof ~ ~ ~ 0 0 0 0 2 force")
        DoKnockback(e.npc.getAttackTarget(), e.npc, -1, .5)
        e.npc.world.playSoundAt(e.npc.pos, "customnpcs:misc.swosh", .4, 2)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.spider.ambient", .4, 2)
        e.npc.ai.setWalkingSpeed(6)
        e.npc.timers.forceStart(1, getRandomInt(20, 60), false)
    }

}


state_panicking.timer = function (e) {
    state_panicking.defaultPanickingTimer(e)
    state_idle.timer(e)
}