function perk_flood_lockpick(e, cost) {
    if (e.player.hasTag("flood_lockpick")) {
        e.player.removeTag("flood_lockpick")
        displayTitle(e, "Flood Lockpick Disabled", '#00FFFF')
        e.player.playSound("item.bucket.empty", 1, 1)
        addToScore("perk_power", cost)
        return
    }
    if (!attemptToUsePerkPower(e, cost)) {
        return
    }
    e.player.addTag("flood_lockpick")
    e.player.playSound("item.bucket.fill", 1, 1)
    displayTitle(e, "You form a lockpick shape out of water", '#00FFFF')
}