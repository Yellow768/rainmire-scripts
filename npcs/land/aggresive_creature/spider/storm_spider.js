var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/boiler/base_npc_script.js')

var state_aggro = new State("state_aggro")
/**
 * @param {NpcEvent.TargetEvent} e
 */



state_idle.target = function (e) {
    StateMachine.transitionToState(state_aggro, e)
}

state_aggro.enter = function (e) {
    e.npc.timers.forceStart(1, 20, false)
    e.npc.timers.forceStart(2, 40, true)
    e.npc.timers.forceStart(3, 0, true)
}


state_aggro.targetLost = function (e) {
    StateMachine.transitionToState(state_idle, e)
}


state_aggro.exit = function (e) {
    npc.timers.stop(1)
    npc.setMoveStrafing(0)
    npc.timers.stop(2)
}

state_aggro.timer = function (e) {
    if (e.id == 1) {
        e.npc.timers.start(1, getRandomInt(20, 60), false)
        var d = FrontVectors(e.npc, 180, 0, 1, true)
        var block = e.npc.world.getBlock(e.npc.x + d[0], e.npc.y - 1, e.npc.z + d[2])
        if (block.isAir()) return

        DoKnockback(e.npc.getAttackTarget(), e.npc, .3, .5)
        e.npc.world.playSoundAt(e.npc.pos, "customnpcs:misc.swosh", .4, 2)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.spider.ambient", .4, 2)
    }
    if (e.id == 2) {
        var chance = getRandomFloat(0, 100)
        if (chance <= 50) {
            e.npc.setMoveStrafing(-1.2)
            e.npc.setMoveForward(.7)
        }
        else {
            e.npc.setMoveStrafing(1.2)
            e.npc.setMoveForward(.7)
        }
    }
    if (e.id == 3) {
        var d = FrontVectors(e.npc, -75 * e.npc.getMoveStrafing(), 0, 1, true)
        var block = e.npc.world.getBlock(e.npc.x + d[0], e.npc.y - 1, e.npc.z + d[2])
        if (block.isAir() && !e.npc.world.getBlock(e.npc.pos.down(1)).isAir()) {
            e.npc.setMoveStrafing(e.npc.getMoveStrafing() * -1)
            e.npc.timers.forceStart(2, 40, true)
        }
    }
    if (e.id == 4) {
        if (!e.npc.getAttackTarget()) {
            StateMachine.transitionToState(state_idle, e)
        }
    }

}

state_panicking.enter = function (e) {
    state_panicking.applyPanickingEffects(e)
    npc.ai.setWalkingSpeed(8)
}

state_panicking.exit = function (e) {
    state_panicking.revertToDefault()
    npc.ai.setWalkingSpeed(4)
}
