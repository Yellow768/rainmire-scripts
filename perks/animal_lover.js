function perk_animal_lover(e, cost) {
    if (e.player.getFactionPoints(13) > 500) {
        executeCommand('/title ' + e.player.name + ' actionbar {"text":"You are still secreting pheremones","color":"#25EE9A"}')
        return
    }
    if (!attemptToUseHydration(e, cost)) {
        return
    }

    var nE = e.player.world.getNearbyEntities(e.player.pos, 15, 2)
    e.player.addFactionPoints(13, 550)
    e.player.addFactionPoints(14, 550)
    e.player.timers.start(ANIMAL_LOVER_TIMER, 200 * getScore("Charm"), false)
    for (var i = 0; i < nE.length; i++) {
        if (nE[i].getFaction().getId() == 14 || nE[i].getFaction().getId() == 13) {
            if (nE[i].getAttackTarget() == e.player) {
                nE[i].setAttackTarget(null)

            }
            nE[i].executeCommand("/particle minecraft:happy_villager ~ ~ ~ .5 .5 .5 .1 14 force")
            nE[i].executeCommand("/particle minecraft:heart ~ ~1 ~ .5 .5 .5 .1 5 force")

        }
    }
    executeCommand('/title ' + e.player.name + ' actionbar {"text":"Your pheromones will soothe the wild for ' + 10 * getScore("Charm") + ' seconds","color":"#25EE9A"}')
    e.player.world.spawnParticle("splash", e.player.x, e.player.y + 1, e.player.z, .4, .4, .4, .2, 150)
    e.player.timers.start(ANIMAL_LOVER_PARTICLE_TIMER, 20, true)
    e.player.world.playSoundAt(e.player.pos, "minecraft:entity.slime.attack", 1, 1)
    e.player.world.playSoundAt(e.player.pos, "minecraft:block.chorus_flower.grow", 1, 1)
    e.player.world.playSoundAt(e.player.pos, "minecraft:item.bucket.empty_lava", 1, 1)




}