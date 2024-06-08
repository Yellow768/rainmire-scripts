var yMotion = 2

function init(e) {
    e.npc.timers.forceStart(id("crusher"), 15, true)
}

function timer(e) {
    if (e.id == id("crusher")) {
        switch (yMotion) {
            case 2:
                yMotion = -2
                e.npc.world.playSoundAt(e.npc.pos, "minecraft:block.piston.contract", .7, .2)

                e.npc.timers.start(id("crush_sound"), 3, false)
                break;
            case -2:
                yMotion = 2
                e.npc.world.playSoundAt(e.npc.pos, "minecraft:block.piston.extend", .7, .2)
                break;
        }

        e.npc.setMotionY(yMotion)
    }
    if (e.id == id("crush_sound")) {
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.item.break", 1, .2)
    }
}

function collide(e) {
    if (e.entity.type == 1 && e.entity.gamemode == 1) return
    if (e.entity.pos.distanceTo(e.npc.pos) < 2) {
        e.entity.kill()
    }

}