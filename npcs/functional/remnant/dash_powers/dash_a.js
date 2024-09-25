function dasha_interact(e) {

    if (!e.player.hasTag("dash_a")) {
        e.player.showDialog(411, "[Body]")
        return
    }
}