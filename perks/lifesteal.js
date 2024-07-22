function perk_lifesteal(e) {
    e.damage = Math.round(e.damage / 2)
    if (getScore("perk_power") == 0) {
        return
    }
    var amountToHeal = e.damage
    if (amountToHeal > getScore("perk_power")) {
        amountToHeal -= getScore("perk_power")
    }
    setScore("using", amountToHeal)
    e.player.setHealth(e.player.health + amountToHeal)
    if (e.player.getHealth() > e.player.getMaxHealth()) {
        e.player.setHealth(e.player.getMaxHealth())
    }

}
function lifesteal_timers(e) { }