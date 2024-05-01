
function init(e) {
    e.npc.timers.forceStart(1, 0, true)

}

function timer(e) {
    if (e.id == 1) {
        e.npc.setMotionY(2)
        var blockInFront = e.npc.rayTraceBlock(1, true, true)
        if (blockInFront != null) {
            if (e.npc.world.getBlock(blockInFront.getPos().down(1)).isAir()) {
                e.npc.setPos(blockInFront.getPos().down(1))
            }
            else {
                e.npc.timers.stop(1)
                e.npc.timers.forceStart(2, 20, false)
            }
        }
    }
    if (e.id == 2) {
        e.npc.timers.forceStart(1, 0, true)
    }
}