var triggered = false

function init(e) {
    e.npc.timers.forceStart(1, 10, true)
    e.npc.timers.forceStart(2, 20, true)
}

function died(e) {
    e.npc.world.explode(e.npc.x, e.npc.y, e.npc.z, 2, false, false)
    e.npc.despawn()
}

function damaged(e) {
    e.npc.executeCommand("/particle minecraft:block red_terracotta ~ ~ ~ .4 .4 .4 2 10")
    if (e.damageSource.type == "onFire") {
        e.npc.damage(10)

    }
}

function timer(e) {
    if (e.id == 1) {
        if (e.npc.health < 3) {
            e.npc.executeCommand("/particle minecraft:smoke ~ ~ ~ .4 .4 .4 .02 10")
            triggered = true
        }
    }
    if (e.id == 2) {
        if (triggered) {
            e.npc.damage(1)
        }
        else {
            e.npc.setHealth(e.npc.health + 1)
        }
    }

}

