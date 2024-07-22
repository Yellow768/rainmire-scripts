var hotWater = false

/**
 * @param {NpcEvent.InitEvent} e
 */
function init(e) {
    e.npc.timers.forceStart(1, 90, false)
    e.npc.display.setVisible(0)
    e.npc.getDisplay().setShowName(1)
    e.npc.updateClient()
}

/**
 * @param {NpcEvent.TimerEvent} e
 */
function timer(e) {
    if (e.id == 1 && !hotWater) {
        trigger_hot_water(e)
    }
    if (e.id == 2) {
        e.npc.despawn()
    }
    if (e.id == 3) {
        e.npc.executeCommand("particle lava ~ ~ ~ 2 2 2 0 7 force")
        e.npc.executeCommand("particle flame ~ ~ ~ 1.4 1.4 1.4 0 15 force")
        e.npc.executeCommand("particle bubble_pop ~ ~ ~ 2 2 2 0 70 force")
        e.npc.executeCommand("particle bubble ~ ~ ~ 2 2 2 0 70 force")
        e.npc.executeCommand("particle dust 1 0 0 1 ~ ~ ~ 2 2 2 0 70 force")

    }
    if (e.id == 4) {
        var entities = e.npc.getWorld().getNearbyEntities(e.npc.getPos(), 3, 5)
        for (var i = 0; i < entities.length; i++) {

            if (entities[i] != e.npc && entities[i].name != "Magma Rock" && entities[i].name != "Draqua") {
                entities[i].damage(1)
                e.npc.getWorld().playSoundAt(entities[i].pos, "minecraft:entity.generic.burn", 1, 1)
            }
        }
        e.npc.getWorld().playSoundAt(e.npc.pos, "minecraft:block.lava.ambient", 2, 2)
    }
}

function trigger_hot_water(e) {
    e.npc.setMotionX(0)
    e.npc.setMotionY(0)
    e.npc.setMotionZ(0)
    hotWater = true
    e.npc.display.setVisible(1)
    e.npc.getDisplay().setHitboxState(1)
    e.npc.updateClient()
    e.npc.timers.forceStart(2, 80, false)
    e.npc.timers.forceStart(3, 2, true)
    e.npc.timers.forceStart(4, 5, true)
    e.npc.getWorld().spawnParticle("campfire_cosy_smoke", e.npc.x, e.npc.y, e.npc.z, 1, 1, 1, 1, 130)
    e.npc.getWorld().playSoundAt(e.npc.pos, "minecraft:item.firecharge.use", 1, .2)
}

function tick(e) {
    if (!e.npc.inWater()) {
        e.npc.despawn()
    }
    if (Math.abs(e.npc.getMotionX()) < 1 && Math.abs(e.npc.getMotionZ()) < 1 && !hotWater) {
        trigger_hot_water(e)
    }
}

function collide(e) {
    if (!hotWater) {
        trigger_hot_water(e)
    }
}

function interact(e) {
    e.npc.timers.stop(1)
    e.npc.timers.stop(2)
    e.npc.timers.stop(3)
    e.npc.timers.stop(4)
}



