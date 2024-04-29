var dead

function init(e) {
    dead = false
}

function tick(e) {
    if (e.npc.getAttackTarget() != null && !e.npc.timers.has(1) && !dead) {
        var chance = Math.random()
        if (chance >= 0.5) {
            e.npc.setMoveStrafing(1)
        }
        else {
            e.npc.setMoveStrafing(-1)
        }
        e.npc.timers.start(1, getRandomInt(20, 90), false)
        e.npc.ai.setWalkingSpeed(1)

    }
    if (e.npc.getAttackTarget() != null && e.npc.getAttackTarget().pos.distanceTo(e.npc.pos) > 8) {
        e.npc.ai.setWalkingSpeed(5)
    }
    else {
        e.npc.ai.setWalkingSpeed(1)
    }
}

function timer(e) {
    if (dead) {
        return
    }
    e.npc.knockback(2, e.npc.rotation)
    e.npc.setMoveForward(1)
    e.npc.jump()

    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.wolf.ambient", 1, getRandomFloat(0.8, 1.2))
}

function died(e) {
    dead = true
}