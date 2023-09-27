var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
var SCOREBOARD = API.getIWorld("overworld").getScoreboard()

function getPlayerScore(player, objective) {
    if (SCOREBOARD.hasObjective(objective) && SCOREBOARD.hasPlayerObjective(player.name, objective)) {
        return API.getIWorld("overworld").getScoreboard().getPlayerScore(player.name, objective)
    }
    else {
        return 0
    }

}

function setPlayerScore(player, objective, value) {
    API.getIWorld("overworld").getScoreboard().setPlayerScore(player.name, objective, value)
}

function addToPlayerScore(player, objective, amount) {
    API.getIWorld("overworld").getScoreboard().setPlayerScore(player.name, objective, getPlayerScore(objective) + amount)
}

function tickEventPlayerTickEvent(e) {
    var player = API.getIEntity(e.event.player)
    var sprint = .08 + (0.04 * (getPlayerScore(player, "Deftness") - 1))
    if (player.hasTag("winded")) {
        sprint = sprint = .08 + (0.02 * (getPlayerScore(player, "Deftness") - 1))
    }
    var walk = .08 + (0.01 * (getPlayerScore(player, "Deftness") - 1))
    if (player.isSprinting()) {

        API.executeCommand(player.world, "attribute " + player.name + " minecraft:generic.movement_speed base set " + sprint)
    }
    else {
        API.executeCommand(player.world, "attribute " + player.name + " minecraft:generic.movement_speed base set " + walk)
    }

    player.setHunger(10)

}