function tick(e) {
    if (!e.player.hasTag("outOfMapLimits") && !e.player.hasTag("ignoreMap")) {
        if (e.player.x > 1200 || e.player.x < 0 || e.player.z < 0 || e.player.z > 1500) {
            e.player.message("&dThe remnants within you compell you to turn back. The further you go, the weaker you feel.")
            e.player.playSound("minecraft:entity.elder_guardian.death", .5, .7)
            e.player.addTag("outOfMapLimits")
        }
    }
    if (e.player.hasTag("outOfMapLimits") && !e.player.hasTag("ignoreMap")) {
        if (e.player.getPotionEffect(20) == -1 && (e.player.x > 1300 || e.player.x < -100 || e.player.z > 1600 || e.player.z < -100)) {
            e.player.addPotionEffect(20, 10, 7, true)
            e.player.message("&dYour flesh starts to rot. Your very soul feels frail.")
        }
        if ((e.player.x > 1500 || e.player.x < -300 || e.player.z > 1800 || e.player.z < -300)) {
            e.player.kill()
            e.player.message("§0Your life force is snuffed out")
        }
        if (e.player.x < 1200 && e.player.x > 0 && e.player.z > 0 && e.player.z < 1500) {
            e.player.removeTag("outOfMapLimits")
        }
    }
}