function perk_levitate(e, cost) {

    if (e.player.inWater()) {
        return
    }
    if (!attemptToUsePerkPower(e, cost)) {
        executeCommand("/attribute " + e.player.name + " forge:entity_gravity base set 0.08")
        e.player.removeTag("levitating")
        executeCommand("stopsound " + e.player.name + " weather minecraft:weather.rain")
        return
    }
    executeCommand("/attribute " + e.player.name + " forge:entity_gravity base set -0.000")
    e.player.addTag("levitating")
    executeCommand("/playsound minecraft:weather.rain weather @a " + e.player.x + " " + e.player.y + " " + e.player.z + " 1")


}

function levitate_timers(e) { }