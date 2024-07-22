var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
var scoreboard, playerName
var reduce = false
var world = API.getIWorld("overworld")
function playerDestroyItemEvent(event) {
    var player = API.getIEntity(event.event.entity)
    if (player.tempdata.get("perk_tags").indexOf("collateral_damage") != -1) {
        player.damage(6)
    }
}

function livingKnockBackEvent(e) {
    var player = API.getIEntity(e.event.entity)
    if (player.tempdata.has("perk_tags") && player.tempdata.get("perk_tags").indexOf("bouncy") != -1) {
        e.event.setStrength(e.event.getStrength() + 1.2)
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