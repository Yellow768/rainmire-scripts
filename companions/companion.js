var isSwimmingMode = false

function init(e) {
    e.npc.role.setInfinite(true)
    e.npc.timers.forceStart(1, 80, true)
}

function interact(e) {
    e.npc.role.setFollowing(e.player)
}

function timer(e) {
    if (e.id == 1 && e.npc.role.getFollowing() != null && e.npc.role.isFollowing()) {
        var following = e.npc.role.getFollowing()

        if (following.inWater() == true && !isSwimmingMode) {
            e.npc.ai.setNavigationType(2)
            e.npc.reset()
            e.npc.setPos(following.getPos())
            isSwimmingMode = true
        }

        if (!following.inWater() && isSwimmingMode) {
            e.npc.ai.setNavigationType(0)
            e.npc.reset()
            e.npc.setPos(following.getPos())
            isSwimmingMode = false
        }
    }
}