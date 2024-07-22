var isSurfacing = false
var distanceToSurface
var surfaceBlock

function perk_resurface(e, cost) {
    if (!e.player.inWater()) {
        return
    }
    distanceToSurface = 0
    var canSurface = false
    for (var i = 0; i < 100; i++) {
        var blockName = e.player.world.getBlock(e.player.x, e.player.y + i, e.player.z).name
        if (blockName != "minecraft:air" && blockName != "minecraft:water" && !canSurface) {
            e.player.message("No where to surface")
            return
        }
        if (blockName == "minecraft:air" && canSurface == false) {
            canSurface = true
            surfaceBlock = e.player.pos.offset(1, i)
        }
    }
    if (!attemptToUseHydration(e, cost) || !canSurface) {
        return
    }
    isSurfacing = true
    e.player.storeddata.put("currentAir", -20)
    var nbt = e.player.getEntityNbt()
    nbt.setInteger("Air", -20)
    e.player.setEntityNbt(nbt)
    e.player.setMotionY(1)
    e.player.world.playSoundAt(e.player.pos, "minecraft:entity.shulker.shoot", 15, 1)
    e.player.timers.forceStart(RESURFACE_TIMER, 1, true)
    e.player.world.spawnParticle("minecraft:poof", e.player.x, e.player.y + 2, e.player.z, .2, .5, .2, .2, 400)

}


function isSurfaceValid(e) {
    return (isSurfacing && e.player.inWater())
}

function applyUpwardMotion(e) {
    distanceToSurface = surfaceBlock.distanceTo(e.player.pos)
    if (distanceToSurface < 1) {
        distanceToSurface = 1
    }
    e.player.setMotionY(1 + (distanceToSurface / 4))
    e.player.world.spawnParticle("minecraft:poof", e.player.x, e.player.y + 1, e.player.z, .2, .5, .2, .2, 400)
    e.player.playSound("minecraft:block.bubble_column.upwards_inside", 1, 1)
}

function stopSurfacing(e) {
    isSurfacing = false
    e.player.timers.stop(RESURFACE_TIMER)
    e.player.world.spawnParticle("minecraft:poof", e.player.x, e.player.y + 1, e.player.z, .2, .5, .2, .2, 400)
    e.player.world.playSoundAt(e.player.pos, "minecraft:entity.player.splash.high_speed", 1, 1)
    e.player.timers.forceStart(REMOVE_RESURFACED_TIMER, 40, false)
    e.player.addTag("resurfaced")
}


function resurface_timers(e) { }