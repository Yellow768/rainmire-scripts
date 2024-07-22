function levitate(e) {

    if (player.inWater()) {
        return
    }
    if (!attemptToUseHydration(1)) {
        player.removeTag("levitating")
        executeCommand("stopsound " + player.name + " weather minecraft:weather.rain")
        player.timers.stop(id("levitate_timer"))
        player.timers.stop(id("levitate_particles_timer"))
        executeCommand("/attribute " + player.name + " forge:entity_gravity base set 0.08")
        deactivateLevitation(e)
        return
    }

    executeCommand("/attribute " + player.name + " forge:entity_gravity base set 0")
    player.addTag("levitating")
    player
    executeCommand("/playsound minecraft:weather.rain voice @a " + player.x + " " + player.y + " " + player.z + " 1")



}

var prevY
function levitate_timers(e) {
    switch (e.id) {
        case id("levitate_float_timer"):
            executeCommand("/attribute " + player.name + " forge:entity_gravity base set 0")
            player.setMotionY(0)
            break;
        case id("levitate_timer"):
            levitate(e)
            break;
        case id("prevent_low_falldamage_levitate"):
            // player.removeTag("noLevitateFallDamage")
            break;
        case id("levitate_particles_timer"):
            if (!player.hasTag("levitating")) return
            player.world.spawnParticle("falling_water", player.x, player.y - 2, player.z, 0.1, .7, 0.1, 1, 50)
            player.world.spawnParticle("bubble_pop", player.x, player.y, player.z, 0.3, .2, 0.3, .01, 100)
            player.getMCEntity().f_19789_ = 0
            break;

        case id("check_levitate_invalid"):
            if (isOnGround(player) || player.inWater()) {
                player.message("isOnGround == " + isOnGround(player) + "    inWater == " + player.inWater())
                deactivateLevitation(e)
                player.timers.stop(id("levitate_timer"))
                player.timers.stop(id("levitate_particles_timer"))
                player.timers.stop(id("check_levitate_invalid"))
                player.timers.stop(id("levitate_float_timer"))
                return
            }
            break;
    }
}

function deactivateLevitation(e) {
    player.getMCEntity().f_19789_ = 0
    player.timers.stop(id("levitate_timer"))
    player.timers.stop(id("levitate_particles_timer"))
    player.timers.stop(id("levitate_float_timer"))
    executeCommand("/attribute " + player.name + " forge:entity_gravity base set 0.08")
    player.removeTag("levitating")
    //player.addTag("noLevitateFallDamage")
    //player.timers.forceStart(id("prevent_low_falldamage_levitate"), 8, false)
    executeCommand("stopsound " + player.name + " voice minecraft:weather.rain")
}
