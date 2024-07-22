var tooLate = false

function init(e) {

    e.player.timers.stop(id("maintainY"))
    e.player.timers.stop(id("checkForLowHealth"))
    e.player.timers.stop(11)
}

function chat(e) {
    if (e.message == "Start Scene") {
        e.player.timers.start(id("closeElevator"), 20, false)
    }

}

function interact(e) {
    e.setCanceled(tooLate)

}

function dialogOption(e) {
    if (e.dialog.id == 343) {
        e.player.world.getBlock(1638, 156, 1198).interact(0)
        e.player.timers.start(id("checkForLowHealth"), 0, true)
    }
}

function timer(e) {
    if (e.id == id("startLift")) {
        e.player.world.getBlock(1746, 227, 248).interact(0)
        e.player.message("ahhh")
    }

    if (e.id == id("ElevatorDescend")) {
        e.player.world.getBlock(1638, 156, 1198).interact(0)
        e.player.timers.start(id("startAetherlicDialog"), 280, false)
    }
    if (e.id == id("startAetherlicDialog")) {
        e.player.showDialog(343, "§bAethelric")
    }
    if (e.id == id("checkForLowHealth")) {
        if (e.player.health < 4) {
            e.player.setPosition(1559, 173, 1193)
            e.player.world.spawnParticle("explosion", 1559, 173, 1193, 4, 4, 4, 0, 100)
            e.player.world.spawnParticle("cloud", 1559, 173, 1193, 4, 4, 4, 0, 100)
            e.player.playSound("minecraft:entity.ender_dragon.death", 1, 1)
            e.player.playSound("minecraft:entity.generic.explode", 1, 1)
            e.player.timers.stop(id("checkForLowHealth"))
            e.player.timers.start(id("maintainY"), 0, true)
            e.player.timers.start(id("stopMaintainY"), 35, false)


        }

    }
    if (e.id == id("maintainY")) {
        e.player.setPosition(1559, 173, 1193)
        e.player.world.spawnParticle("explosion", 1559, 173, 1193, 4, 4, 4, 0, 100)
        e.player.world.spawnParticle("cloud", 1559, 173, 1193, 4, 4, 4, 0, 100)
    }
    if (e.id == id("stopMaintainY")) {
        e.player.timers.stop(id("maintainY"))
        e.player.timers.start(id("checkForLowY"), 0, true)
    }
    if (e.id == id("checkForLowY")) {
        if (e.player.y < 78) {
            e.API.executeCommand(e.player.world, "/title @a times 0 200 0")
            e.API.executeCommand(e.player.world, '/title @a title {"text":"𐌺☎𐌼"}')
            e.player.timers.stop(id("checkForLowY"))
            e.player.gamemode = 1
            e.player.timers.start(id("startIntroDialog"), 90, false)

        }
    }
    if (e.id == id("startIntroDialog")) {
        e.player.showDialog(331, "???")
    }
}