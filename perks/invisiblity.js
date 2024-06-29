function perk_invisibility(e, cost) {
    if (!attemptToUseHydration(e, cost)) {
        disablePerk(e, "refraction")
        return
    }
    if (!e.player.hasTag("refracting")) {
        e.player.addTag("refracting")
        e.player.world.spawnParticle("bubble_pop", e.player.x, e.player.y + 1, e.player.z, .3, .5, .3, .01, 500)
        e.player.world.playSoundAt(e.player.pos, "minecraft:ambient.underwater.enter", 1, .7)

    }
    e.player.addPotionEffect(14, 1, 1, false)
    e.player.timers.forceStart(INVISIBILITY_TIMER, 15, false)


}

function invisibility_timers(e) { }