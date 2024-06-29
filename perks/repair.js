function perk_repair(e, cost) {
    if (!e.player.getMainhandItem().isDamageable() || e.player.getMainhandItem().nbt.getBoolean("repaired") == true) {
        e.player.message("&cThis item's already been repaired or does not need to be repaired")
        return
    }
    if (!attemptToUseHydration(e, cost)) {
        return
    }
    var repairAmount = 30 + (Math.random() * 10) * getScore("Knowledge")
    e.player.getMainhandItem().setDamage(e.player.getMainhandItem().getDamage() - Math.floor(repairAmount))
    var nbt = e.player.getMainhandItem().nbt.setBoolean("repaired", true)
    e.player.getMainhandItem()
    e.player.message("&aYour hydration fills in the cracks of your " + e.player.getMainhandItem().getDisplayName())
}