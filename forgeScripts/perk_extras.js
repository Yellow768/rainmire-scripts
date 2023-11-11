var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
var scoreboard, playerName
var reduce = false
var world = API.getIWorld("overworld")
function tickEventPlayerTickEvent(e) {

    var noppesPlayer = API.getIEntity(e.event.player)
    scoreboard = noppesPlayer.world.getScoreboard()
    playerName = noppesPlayer.name
    if (noppesPlayer.hasTag("onIcicle")) {
        noppesPlayer.setMotionY(0)
        noppesPlayer.y = noppesPlayer.y
    }
}

function worldOut(text) {
    return API.getIWorld("overworld").broadcast(text);
}

function getScore(scoreBoardName) {
    if (scoreboard.hasPlayerObjective(playerName, scoreBoardName)) {
        return scoreboard.getPlayerScore(playerName, scoreBoardName)
    }
}

function setScore(scoreBoardName, val) {
    if (scoreboard.hasPlayerObjective(playerName, scoreBoardName)) {
        scoreboard.setPlayerScore(playerName, scoreBoardName, val)
    }
}

function addToScore(scoreBoardName, val) {
    if (scoreboard.hasPlayerObjective(playerName, scoreBoardName)) {
        scoreboard.setPlayerScore(playerName, scoreBoardName, getScore(scoreBoardName) + val)
    }
}