
/**
 * @param {NpcEvent.TargetEvent} e
 */
function target(e) {
    e.npc.timers.forceStart(1, 20, false)
    e.npc.timers.forceStart(2, 40, true)
}

function targetLost(e) {
    e.npc.timers.stop(1)
    e.npc.setMoveStrafing(0)
    e.npc.timers.stop(2)
}

function timer(e) {
    if (e.id == 1) {
        e.npc.timers.start(1, getRandomInt(20, 60), false)
        DoKnockback(e.npc.getAttackTarget(), e.npc, .3, .5)
        e.npc.world.playSoundAt(e.npc.pos, "customnpcs:misc.swosh", .4, 2)
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.spider.ambient", .4, 2)
    }
    if (e.id == 2) {
        var chance = getRandomFloat(0, 100)
        if (chance <= 50) {
            e.npc.setMoveStrafing(-1.2)
            e.npc.setMoveForward(0)
        }
        else {
            e.npc.setMoveStrafing(1.2)
            e.npc.setMoveForward(0)
        }
    }

}

function died(e) {
    e.npc.timers.stop(1)
    e.npc.setMoveStrafing(0)
    e.npc.timers.stop(2)
}