function perk_ripple(e, cost) {
    if (!e.player.inWater()) {
        return
    }
    if (!attemptToUseHydration(e, cost)) {
        return
    }
    var nE = e.player.world.getNearbyEntities(e.player.pos, 10, 2)
    for (var entity in nE) {
        knockbackEntity(nE[entity], e.player.pos, 9)
    }
    spawnCircularParticles(e, "bubble_pop", 3, .2, 2, e.player.pos)
    e.player.world.playSoundAt(e.player.pos, "minecraft:entity.puffer_fish.blow_out", 1, .8)
    e.player.world.playSoundAt(e.player.pos, "minecraft:entity.player.splash", 1, .8)
}