function perk_electric_eel(e, cost) {
    if (!e.player.inWater()) {
        return
    }
    if (!attemptToUsePerkPower(e, cost)) {
        return
    }
    var nE = e.player.world.getNearbyEntities(e.player.pos, 15, 2)
    for (var i = 0; i < nE.length; i++) {
        if (nE[i].inWater()) {
            e.player.trigger(10, [e, nE[i], 1, 100])
        }
    }
    e.player.world.spawnParticle("angry_villager", e.player.x, e.player.y, e.player.z, .4, .4, .4, .2, 100)

}