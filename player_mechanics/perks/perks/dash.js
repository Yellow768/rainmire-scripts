


function perk_dash(e, cost) {
    if (!attemptToUsePerkPower(e, cost)) {
        return
    }
    var direction = e.player.getRotation()

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
    var deftnessModifier = (getScore("Deftness")) / 4
    if (e.player.getMCEntity().m_5842_()) {
        d = FrontVectors(e.player, direction, -e.player.pitch, 1.6 + deftnessModifier, false)
    }
    else {
        d = FrontVectors(e.player, direction, 7, 1.6 + deftnessModifier, false)
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
    e.player.timers.forceStart(DASH_TIMER, 15, false)
    e.player.addTag("isDashing")
    e.player.world.playSoundAt(e.player.pos, "minecraft:item.bucket.empty", 1, 1)
    e.player.world.playSoundAt(e.player.pos, "variedcommodities:magic.shot", 1, 1)
    e.player.world.playSoundAt(e.player.pos, "minecraft:ambient.underwater.exit", 1, 1)


}