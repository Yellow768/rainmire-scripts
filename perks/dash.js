
var direction

function dash(e) {
    if (!attemptToUseHydration(e, 3)) {
        return
    }
    direction = e.player.getRotation()

    if (isMovingForward) {
        direction = e.player.getRotation()
    }
    if (isMovingBackwards) {
        direction = e.player.getRotation() + 180
    }
    if (isMovingLeft) {
        direction -= 90
        if (isMovingForward) {
            direction += 45
        }
        if (isMovingBackwards) {
            direction += 135
        }
    }
    if (isMovingRight) {
        direction += 90
        if (isMovingForward) {
            direction -= 45
        }
        if (isMovingBackwards) {
            direction -= 135
        }
    }
    var d
    e.player.timers.forceStart(id("DASH_COLLISION_CHECK"), 0, true)
    if (e.player.getMount()) {
        d = FrontVectors(e.player, e.player.getMount().getRotation(), 0, 1.6, false)
    }
    else if (e.player.getMCEntity().m_5842_()) {
        d = FrontVectors(e.player, direction, -e.player.pitch, 1.6, false)
    }
    else {
        d = FrontVectors(e.player, direction, 7, 1.6, false)
    }
    if (e.player.getMount()) {
        e.player.getMount().setMotionY(d[1])
        e.player.getMount().setMotionX(d[0])
        e.player.getMount().setMotionZ(d[2])
    }
    if (!e.player.getMCEntity().m_20096_()) {
        e.player.setMotionY(d[1] / 1.55)
        e.player.setMotionX(d[0] / 1.55)
        e.player.setMotionZ(d[2] / 1.55)
    }
    else {
        e.player.setMotionY(d[1])
        e.player.setMotionX(d[0])
        e.player.setMotionZ(d[2])
    }
    e.player.timers.forceStart(id("DASH_TIMER"), 15, false)
    e.player.timers.forceStart(id("dash_visual_effects"), 0, true)

    e.player.addTag("isDashing")
    e.player.world.playSoundAt(e.player.pos, "minecraft:item.bucket.empty", 1, 1)
    e.player.world.playSoundAt(e.player.pos, "variedcommodities:magic.shot", 1, 1)
    e.player.world.playSoundAt(e.player.pos, "minecraft:ambient.underwater.exit", 1, 1)


}

var delay = 0

function dash_timers(e) {
    switch (e.id) {
        case id("DASH_TIMER"):
            e.player.removeTag("isDashing")
            e.player.timers.stop(id("DASH_COLLISION_CHECK"))
            e.player.timers.stop(id("dash_visual_effects"))
            //e.player.world.playSoundAt(e.player.pos, "minecraft:weather.rain", .2, 1)
            break;
        case id("DASH_COLLISION_CHECK"):
            if (e.player.isSneaking()) {
                e.player.removeTag("isDashing")
                e.player.timers.stop(id("DASH_COLLISION_CHECK"))
                e.player.timers.stop(id("DASH_TIMER"))
                e.player.setMotionX(0)
                e.player.setMotionZ(0)
            }
            break;
        case id("dash_visual_effects"):
            var angle = e.player.getRotation()
            var dx = -Math.sin(angle * Math.PI / 180)
            var dz = Math.cos(angle * Math.PI / 180)
            // e.player.world.spawnParticle("cloud", e.player.x, e.player.y + 1, e.player.z, 0.1, .1, 0.1, .01, 5)
            e.player.world.spawnParticle("bubble_pop", e.player.x - dx, e.player.y + 1, e.player.z - dz, 0.1, .1, 0.1, .01, 50)
            e.player.world.spawnParticle("falling_water", e.player.x - dx, e.player.y + 1, e.player.z - dz, 0.1, .2, 0.1, 1, 5)
            break
    }
}
