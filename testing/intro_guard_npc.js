var npc
function init(e) {
    npc = e.npc

    npc.trigger(id("init"))
    npc.timers.stop(id("checkForPlayer"))
    e.npc.timers.stop(id("checkForPlayer2"))
    e.npc.timers.stop(id("checkForPlayer3"))
    e.npc.timers.stop(id("checkForPlayer4"))
}


function trigger(e) {
    if (e.id == id("init")) {
        npc.setPosition(1724, 206, 386)
    }
    if (e.id == id("enterPlayerCell")) {
        npc.world.getBlock(1720, 206, 386).setBlock("air")
        npc.world.getBlock(1720, 207, 386).setBlock("air")

        npc.navigateTo(1716, 206, 382, 1)

        npc.timers.forceStart(id("sayWhatName"), 100, false)
        npc.world.playSoundAt(npc.world.getBlock(1720, 206, 386).getPos(), "minecraft:block.chain.break", 1, 1)
        npc.world.playSoundAt(npc.world.getBlock(1720, 206, 386).getPos(), "minecraft:block.fence_gate.open", 1, 1)
    }
    if (e.id == id("navigateToFirstCorner")) {
        npc.navigateTo(1781, 206, 386, 2)
        npc.timers.forceStart(id("navigateToFirstCorner"), 60, false)
    }
}

function timer(e) {
    if (e.id == id("sayWhatName")) {
        e.npc.say("Prisoner, what's your name?")
        e.npc.rotation = GetAngleTowardsEntity(npc, npc.tempdata.get("player"))
        e.npc.pitch = 45
    }
    if (e.id == id("navigateToFirstCorner")) {
        npc.navigateTo(1790, 206, 386, 2)
        npc.timers.forceStart(id("startCheckingForPlayer"), 180, false)
    }
    if (e.id == id("startCheckingForPlayer")) {
        e.npc.timers.forceStart(id("checkForPlayer"), 0, true)
    }
    if (e.id == id("checkForPlayer")) {
        if (e.npc.tempdata.get("player").pos.distanceTo(e.npc.pos) < 5) {
            npc.navigateTo(1746, 206, 366, 2)
            if (!e.npc.timers.has(id("startCheckForPlayer2"))) {
                e.npc.timers.forceStart(id("startCheckForPlayer2"), 180, false)
            }
        }
    }
    if (e.id == id("startCheckForPlayer2")) {
        e.npc.timers.stop(id("checkForPlayer"))
        e.npc.timers.forceStart(id("checkForPlayer2"), 0, true)
        e.npc.timers.forceStart(id("checkForPlayer3"), 0, true)
    }
    if (e.id == id("checkForPlayer2")) {
        if (e.npc.tempdata.get("player").pos.distanceTo(e.npc.pos) < 5) {
            npc.navigateTo(1746, 206, 262, 2)
        }
    }
    if (e.id == id("checkForPlayer3")) {
        if (e.npc.tempdata.get("player").pos.distanceTo(e.npc.world.getBlock(1746, 206, 262).getPos()) < 5) {
            e.npc.timers.stop(id("checkForPlayer3"))
            e.npc.say("Here we are @p. Step into the lift and you will be taken to the surface, where you'll become a free citizen of Rainmire. Congratulations.")
            npc.world.getBlock(1746, 206, 257).setBlock("air")
            npc.world.getBlock(1746, 207, 257).setBlock("air")
            npc.world.playSoundAt(npc.world.getBlock(1746, 207, 257).getPos(), "minecraft:block.chain.break", 1, 1)
            npc.world.playSoundAt(npc.world.getBlock(1746, 207, 257).getPos(), "minecraft:block.fence_gate.open", 1, 1)
            e.npc.timers.start(id("checkForPlayer4"), 0, true)
        }
    }
    if (e.id == id("checkForPlayer4")) {
        if (e.npc.tempdata.get("player").pos.distanceTo(e.npc.world.getBlock(1746, 206, 254).getPos()) < 3) {
            npc.world.getBlock(1746, 206, 257).setBlock("iron_bars")
            npc.world.getBlock(1746, 207, 257).setBlock("iron_bars")
            npc.world.playSoundAt(npc.world.getBlock(1746, 207, 257).getPos(), "minecraft:block.chain.break", 1, 1)
            npc.world.playSoundAt(npc.world.getBlock(1746, 207, 257).getPos(), "minecraft:block.fence_gate.close", 1, 1)
            e.npc.timers.stop(id("checkForPlayer4"))
            npc.navigateTo(1746, 206, 366, 2)
            e.npc.tempdata.get("player").timers.start(id("startLift"), 90, false)
        }
    }

}