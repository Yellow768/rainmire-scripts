function perk_revenge_attack(e, cost) {
    if (e.player.hasTag("collectingRevenge")) {
        if (!attemptToUseHydration(e, 2)) { return }
        if (!e.player.tempdata.has("revengeDamage")) { e.player.tempdata.put("revengeDamage", 0) }
        e.player.tempdata.put("revengeDamage", e.player.tempdata.get("revengeDamage") + 1)
        e.player.world.playSoundAt(e.player.pos, "minecraft:item.bucket.fill_fish", 1, 1)
        displayTitle(e, e.player.tempdata.get("revengeDamage"), 'blue')
        e.player.world.spawnParticle("upgrade_aquatic:blue_jelly_blob", e.player.x, e.player.y + 1, e.player.z, .2, .4, .2, .0002, 10)
    }
}

function perk_revenge_attack_damage(e) {
    if (e.player.tempdata.has("revengeDamage")) {
        e.damage += e.player.tempdata.get("revengeDamage")
        e.player.tempdata.remove("revengeDamage")
        e.player.world.playSoundAt(e.target.pos, "minecraft:entity.player.splash.high_speed", 1, 1)
        e.player.world.spawnParticle("falling_water", e.target.x, e.target.y + 1, e.target.z, .2, .4, .2, 1, e.damage * 10)
        e.player.world.spawnParticle("damage_indicator", e.target.x, e.target.y + 1, e.target.z, .2, .4, .2, 1, e.damage * 5)
    }
}

function revenge_attack_timers(e) { }