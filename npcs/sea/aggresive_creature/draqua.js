/**
 * @param {NpcEvent.TargetEvent} e
 */
function target(e) {
    e.npc.getTimers().forceStart(1, getRandomInt(40, 120), false)
}

/**
 * @param {NpcEvent.TimerEvent} e
 */
function timer(e) {
    if (e.id == 1) {
        e.npc.getTimers().forceStart(2, 40, false)
        e.npc.getWorld().playSoundAt(e.npc.pos, "supplementaries:block.bellows.retract", 1, .2)
        e.npc.getWorld().playSoundAt(e.npc.pos, "minecraft:block.lava.ambient", 1, .2)
        e.npc.getWorld().playSoundAt(e.npc.pos, "minecraft:entity.ender_dragon.ambient", 1, .2)
        e.npc.getWorld().spawnParticle("flame", e.npc.x, e.npc.y, e.npc.z, 1, 1, 1, .2, 130)

    }
    if (e.id == 2) {
        var rotation = e.npc.rotation
        var pitch = 0
        if (e.npc.getAttackTarget()) {
            rotation = GetAngleTowardsEntity(e.npc, e.npc.getAttackTarget())
            var difference = e.npc.getAttackTarget().y - e.npc.y
            pitch = 0 + (10 * difference)
            if (pitch > 90) pitch = 90
            if (pitch < -90) pitch = -90
        }
        var pos = FrontVectors(e.npc, rotation, pitch, 1.5, 0)
        var prong = e.API.getClones().spawn(e.npc.x + pos[0], e.npc.y + pos[1], e.npc.z + pos[2], 1, "Magma Rock", e.npc.world)
        prong.setMotionX(pos[0])
        prong.setMotionY(pos[1] / 2)
        prong.setMotionZ(pos[2])
        prong.rotation = e.npc.rotation
        prong.updateClient()
        if (e.npc.getAttackTarget()) {
            e.npc.getTimers().forceStart(1, getRandomInt(40, 120), false)
        }
        e.npc.getWorld().playSoundAt(e.npc.pos, "minecraft:item.firecharge.use", 1, .2)
        e.npc.getWorld().playSoundAt(e.npc.pos, "minecraft:ambient.underwater.enter", 1, .2)
        e.npc.getWorld().spawnParticle("campfire_cosy_smoke", e.npc.x + pos[0], e.npc.y + pos[1], e.npc.z + pos[2], 1, 1, 1, 0, 130)
    }
}

/**
 * @param {NpcEvent.DiedEvent} e
 */
function died(e) {
    e.npc.getTimers().stop(1)
    e.npc.getTimers().stop(2)
}