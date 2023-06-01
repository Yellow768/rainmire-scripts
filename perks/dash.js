function perk_dash(e, cost) {
    if (e.player.inWater()) {
        return
    }
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


    if (e.player.getMotionY() != noVelocity) {
        e.player.knockback(2, direction)
    }
    else {
        e.player.setMotionY(.2)
        e.player.knockback(4, direction)
    }
    e.player.timers.forceStart(DASH_TIMER, 15, false)
    e.player.addTag("isDashing")
    e.player.world.playSoundAt(e.player.pos, "minecraft:item.bucket.empty", 1, 1)
    e.player.world.playSoundAt(e.player.pos, "variedcommodities:magic.shot", 1, 1)
    e.player.world.playSoundAt(e.player.pos, "minecraft:ambient.underwater.exit", 1, 1)


}