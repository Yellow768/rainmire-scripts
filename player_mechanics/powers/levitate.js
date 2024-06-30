function levitate(e) {

    if (e.player.inWater()) {
        return
    }
    if (!attemptToUseHydration(e, 1)) {
        e.player.removeTag("levitating")
        executeCommand("stopsound " + e.player.name + " weather minecraft:weather.rain")
        e.player.timers.stop(id("levitate_timer"))
        e.player.timers.stop(id("levitate_particles_timer"))
        executeCommand("/attribute " + e.player.name + " forge:entity_gravity base set 0.08")
        deactivateLevitation(e)
        return
    }
    e.player.setMotionY(-0)

    e.player.addTag("levitating")
    executeCommand("/playsound minecraft:weather.rain weather @a " + e.player.x + " " + e.player.y + " " + e.player.z + " 1")



}

var prevY
function levitate_timers(e) {
    switch (e.id) {
        case id("levitate_timer"):
            levitate(e)
            break;
        case id("prevent_low_fall_damage_levitate"):
            e.player.removeTag("noLevitateFallDamage")
            break;
        case id("levitate_particles_timer"):
            if (!e.player.hasTag("levitating")) return
            if (isOnGround(e.player)) {
                deactivateLevitation(e)
                e.player.timers.stop(id("levitate_timer"))
                e.player.timers.stop(id("levitate_particles_timer"))
                return
            }
            e.player.setMotionY(-0)
            e.player.world.spawnParticle("falling_water", e.player.x, e.player.y - 2, e.player.z, 0.1, .7, 0.1, 1, 50)
            e.player.world.spawnParticle("bubble_pop", e.player.x, e.player.y, e.player.z, 0.3, .2, 0.3, .01, 100)
            e.player.getMCEntity().f_19789_ = 0
            break;
    }
}

function deactivateLevitation(e) {

    e.player.timers.stop(id("levitate_timer"))
    e.player.timers.stop(id("levitate_particles_timer"))
    executeCommand("/attribute " + e.player.name + " forge:entity_gravity base set 0.08")
    e.player.removeTag("levitating")
    e.player.addTag("noLevitateFallDamage")
    e.player.timers.forceStart(id("prevent_low_falldamage_levitate"), 8, false)
    executeCommand("stopsound " + e.player.name + " weather minecraft:weather.rain")
}