function perk_low_health_damage(e) {
    var modifier = 11 - e.player.health
    if (modifier < 0) {
        modifier = 0
    }
    e.damage += modifier
    e.player.world.spawnParticle("minecraft:enchanted_hit", e.target.x, e.target.y + 1, e.target.z, .5, 1, .5, 0.05, modifier * 5)
    if (modifier > 5) {

        e.player.world.playSoundAt(e.player.pos, "minecraft:entity.player.attack.crit", 1, 1)
        e.player.world.playSoundAt(e.player.pos, "minecraft:entity.boat.paddle_water", 1, 1)
    }
}