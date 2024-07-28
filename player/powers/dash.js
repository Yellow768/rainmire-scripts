
var direction




function dash(e) {
    if (!attemptToUseHydration(3)) {

        return
    }
    direction = player.getRotation()

    if (isMovingForward) {
        direction = player.getRotation()
    }
    if (isMovingBackwards) {
        direction = player.getRotation() + 180
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
    player.timers.forceStart(id("DASH_COLLISION_CHECK"), 0, true)
    if (player.getMount()) {
        d = FrontVectors(player, player.getMount().getRotation(), 0, 1.6, false)
    }
    else if (player.getMCEntity().m_5842_()) {
        d = FrontVectors(player, direction, -player.pitch, .8 * getScore("swmspd"), false)
        e.player.timers.forceStart(id("is_player_underwater"), 0, true)
    }
    else {
        d = FrontVectors(player, direction, 7, 1.6, false)
    }
    if (player.getMount()) {
        player.getMount().setMotionY(d[1])
        player.getMount().setMotionX(d[0])
        player.getMount().setMotionZ(d[2])
    }
    if (!player.getMCEntity().m_20096_()) {
        player.setMotionY(d[1] / 1.55)
        player.setMotionX(d[0] / 1.55)
        player.setMotionZ(d[2] / 1.55)
    }
    else {
        player.setMotionY(d[1])
        player.setMotionX(d[0])
        player.setMotionZ(d[2])
    }
    player.timers.forceStart(id("DASH_TIMER"), 15, false)
    player.timers.forceStart(id("dash_visual_effects"), 0, true)


    player.addTag("isDashing")
    player.world.playSoundAt(player.pos, "minecraft:item.bucket.empty", 1, 1)
    player.world.playSoundAt(player.pos, "variedcommodities:magic.shot", 1, 1)
    player.world.playSoundAt(player.pos, "minecraft:ambient.underwater.exit", 1, 1)


}

var delay = 0

function dash_timers(e) {
    switch (e.id) {
        case id("DASH_TIMER"):

            player.removeTag("isDashing")
            player.timers.stop(id("DASH_COLLISION_CHECK"))
            player.timers.stop(id("dash_visual_effects"))
            e.player.timers.stop(id("is_player_underwater"))
            //player.world.playSoundAt(player.pos, "minecraft:weather.rain", .2, 1)
            break;
        case id("dash_visual_effects"):
            var angle = player.getRotation()
            var dx = -Math.sin(angle * Math.PI / 180)
            var dz = Math.cos(angle * Math.PI / 180)
            // player.world.spawnParticle("cloud", player.x, player.y + 1, player.z, 0.1, .1, 0.1, .01, 5)
            player.world.spawnParticle("bubble_pop", player.x - dx, player.y + 1, player.z - dz, 0.1, .1, 0.1, .01, 50)
            player.world.spawnParticle("falling_water", player.x - dx, player.y + 1, player.z - dz, 0.1, .2, 0.1, 1, 5)
            break
        case id("is_player_underwater"):
            if (!e.player.inWater()) {
                e.player.setMotionY(0)
                e.player.timers.stop(id("is_player_underwater"))
            }

    }
}
