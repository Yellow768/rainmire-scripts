function rangedLaunched(e) {
    e.player.timers.start(99999, 1, false)

}

function timer(e) {
    if (e.id == 99999) {
        var shotArrow
        var arrows = e.player.world.getNearbyEntities(e.player.pos, 8, 10)
        for (var arrow = 0; arrow < arrows.length; arrow++) {
            if (arrows[arrow].getEntityNbt().getInteger("life") == 0) {
                shotArrow = arrows[arrow]

            }

        }
        if (shotArrow == null) {
            return
        }
        for (var i = 0; i < 15; i++) {
            var arrow = e.player.world.createEntityFromNBT(shotArrow.getEntityNbt())
            arrow.generateNewUUID()
            arrow.setPos(shotArrow.pos)
            var spread = 1.2
            arrow.x += getRandomFloat(-spread, spread)
            arrow.y += getRandomFloat(-spread, spread)
            arrow.z += getRandomFloat(-spread, spread)
            e.player.world.spawnEntity(arrow)
        }


    }
}