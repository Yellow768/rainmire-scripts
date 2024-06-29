function perk_companion_buff(e, cost) {
    if (!attemptToUseHydration(e, cost)) {
        return
    }

    var nE = e.player.world.getNearbyEntities(e.player.pos, 10, 2)
    var worked = false
    for (var i = 0; i < nE.length; i++) {
        if (nE[i].hasTag("companion") || nE[i].type == 1) {
            nE[i].addPotionEffect(21, 30, 2, true)
            nE[i].addPotionEffect(11, 30, 2, true)
            nE[i].addPotionEffect(5, 30, 2, true)
            nE[i].addPotionEffect(6, 3, 2, true)
            nE[i].addPotionEffect(1, 30, 2, true)
            spawnCircularParticles(e, "minecraft:soul_fire_flame", 1, .01, 1, nE[i].pos)
            worked = true
        }
    }
    if (!worked) {
        e.player.message("There's no one to hear your cry. Water has been preserved")
        addToScore("perk_power", cost + 1)
        return
    }
    e.player.world.playSoundAt(e.player.pos, "minecraft:item.trident.thunder", 1, 1)
    e.player.world.broadcast("§b" + e.player.name + " screams out their battle cry! Fight on!")


}