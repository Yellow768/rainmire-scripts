var noVelocity = -0.0784000015258789
var groundPounding = false
var flyingUp = false
var initialY = 0
var jumpBoostLevel = -1

function perk_groundPound(e, cost) {
    var cost = 3

    if (groundPounding) {
        return
    }
    if (flyingUp || e.player.getMotionY() == noVelocity) {
        return
    }
    if (!attemptToUsePerkPower(e, cost)) {
        return
    }
    flyingUp = true
    e.player.world.spawnParticle("minecraft:dolphin", e.player.x, e.player.y, e.player.z, .2, 2, .2, .01, 150)
    e.player.world.spawnParticle("minecraft:dolphin", e.player.x, e.player.y, e.player.z, .4, .2, .4, .01, 300)
    e.player.world.playSoundAt(e.player.pos, "variedcommodities:magic.charge", .2, 1)
    e.player.world.playSoundAt(e.player.pos, "minecraft:entity.dolphin.splash", 1, 1)
    if (e.player.getPotionEffect(8) != -1) {
        jumpBoostLevel = e.player.getPotionEffect(8)
        executeCommand("effect clear " + e.player.name + " jump_boost")
    }
    startDownwardMotion(e)
    e.player.timers.forceStart(GROUNDPOUND_VALIDITY_TIMER, 1, false)

}

function startDownwardMotion(e) {

    e.player.world.playSoundAt(e.player.pos, "variedcommodities:magic.shot", 1, 1)
    e.player.setMotionY(-4)
    groundPounding = true
    initialY = e.player.y
}

function isGroundPoundValid(e) {
    if (e.player.inWater()) {
        e.player.timers.stop(GROUNDPOUND_VALIDITY_TIMER)
        flyingUp = false
        groundPounding = false
        if (jumpBoostLevel > -1) {
            e.player.addPotionEffect(8, 25555, jumpBoostLevel, true)
            jumpBoostLevel = -1
        }
        return false
    }
    return e.player.getMotionY() == noVelocity || e.player.world.getBlock(e.player.x, e.player.y - 2, e.player.z).name != "minecraft:air"

}


function activateGroundPound(e) {
    if (jumpBoostLevel > -1) {
        e.player.addPotionEffect(8, 25555, jumpBoostLevel, true)
        jumpBoostLevel = -1
    }
    var distance = initialY - e.player.y
    if (distance < 0) {
        distance = 1
    }


    var nNPCS = e.player.world.getNearbyEntities(e.player.pos, distance * 1.5, 2)
    for (var i = 0; i < nNPCS.length; i++) {
        if (e.player.factionStatus(nNPCS[i].getFaction().getId()) != 1) {
            nNPCS[i].damage(distance * 2.5)
            knockbackEntity(nNPCS[i], e.player.pos, distance)
        }
    }

    if (distance < 6) {
        e.player.world.playSoundAt(e.player.pos, "minecraft:entity.player.splash", 1, 1)
    }
    else {
        e.player.world.playSoundAt(e.player.pos, "minecraft:entity.player.splash.high_speed", 1, 1)
    }
    var radius = distance / 2
    flyingUp = false
    groundPounding = false
    e.player.world.spawnParticle("minecraft:cloud", e.player.x, e.player.y - 1, e.player.z, radius / 4, .02, radius / 4, .5, 20 * distance)
    e.player.world.playSoundAt(e.player.pos, "supplementaries:item.bomb", 1, 1)
    spawnCircularParticles(e, "minecraft:crit", distance, .2, 1, e.player.pos)
    spawnCircularParticles(e, "minecraft:splash", distance, .02, 1, e.player.pos)


    spawnCircularParticles(e, "minecraft:falling_water", distance, .2, 5, e.player.pos)
    e.player.damage(0.0000001)
    e.player.timers.stop(GROUNDPOUND_VALIDITY_TIMER)
}




