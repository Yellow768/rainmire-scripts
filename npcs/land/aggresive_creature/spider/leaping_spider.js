function init(e) {
    //e.npc.timers.forceStart(1, getRandomInt(20, 60), false)
}

function target(e) {
    e.npc.timers.forceStart(1, getRandomInt(20, 60), false)
}

function targetLost(e) {
    e.npc.timers.stop(1)
    e.npc.ai.setWalkingSpeed(6)
}

function died(e) {
    e.npc.timers.stop(1)
    e.npc.timers.stop(2)
    e.npc.ai.setWalkingSpeed(6)
}

function timer(e) {
    if (e.id == 1) {
        if (e.npc.storeddata.get("hasStatusEffect") != 1) e.npc.ai.setWalkingSpeed(0)
        e.npc.timers.forceStart(2, 10, false)
    }
    if (e.id == 2 && e.npc.getAttackTarget() != null) {
        if (e.npc.storeddata.get("hasStatusEffect") != 1) {
            e.npc.executeCommand("/particle minecraft:poof ~ ~ ~ 0 0 0 0 2 force")
            DoKnockback(e.npc.getAttackTarget(), e.npc, -1, .5)
            e.npc.world.playSoundAt(e.npc.pos, "customnpcs:misc.swosh", .4, 2)
            e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.spider.ambient", .4, 2)
            e.npc.ai.setWalkingSpeed(6)
        }
        e.npc.timers.forceStart(1, getRandomInt(20, 60), false)
    }

}