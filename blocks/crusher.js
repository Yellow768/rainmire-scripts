var yMotion = 2

function init(e) {
    e.npc.timers.forceStart(id("crusher"), 15, true)
}

function timer(e) {
    if (e.id == id("crusher")) {
        switch (yMotion) {
            case 2:
                yMotion = -2
                break;
            case -2:
                yMotion = 2
                break;
        }

        e.npc.setMotionY(yMotion)
    }
}

function collide(e) {
    if (e.entity.type == 1 && e.entity.gamemode == 1) return
    if (e.entity.pos.distanceTo(e.npc.pos) < 2) {
        e.entity.kill()
    }

}