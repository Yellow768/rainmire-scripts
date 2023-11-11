function perk_oxygenate(e, cost) {
    if (e.player.storeddata.get("currentAir") == 300) {
        return
    }
    if (e.player.hasTag("oxygenated")) {
        displayTitle(e, "This power is resting", "red")
        return
    }
    if (!attemptToUsePerkPower(e, cost)) {
        return
    }
    e.player.addTag("oxygenating")
    e.player.world.playSoundAt(e.player.pos, "minecraft:entity.puffer_fish.blow_up", 1, 1)
    e.player.world.playSoundAt(e.player.pos, "minecraft:block.conduit.activate", 1, 1)
    displayTitle(e, "You separate the oxygen from the water. This power must rest for 30 seconds", "cyan")
    e.player.world.spawnParticle("bubble_pop", e.player.x, e.player.y + 1, e.player.z, .4, .4, .4, .0002, .250)
    e.player.addTag("oxygenated")
    e.player.timers.forceStart(OXYGENATE_TIMER, 600, false)

}