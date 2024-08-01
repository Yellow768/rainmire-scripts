function interact(e) {
    var nE = e.player.world.getNearbyEntities(e.player.pos, 5, 0)
    for (var i = 0; i < nE.length; i++) {
        if (nE[i].name == "Contraption") {
            e.player.message(e.player.getMount())
        }
    }

}