
var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
var world = api.getIWorld("minecraft:overworld")
var scoreboard = world.getScoreboard()
var playerName
var player






function registerScoreboardPlayer(e) {

    player = e.player
    playerName = e.player.name
}

function getScore(scoreBoardName) {
    if (!player) {
        world.broadcast("Scoreboard player not defined, getScore() cannot work")
        return
    }
    if (scoreboard.hasPlayerObjective(playerName, scoreBoardName)) {
        return scoreboard.getPlayerScore(playerName, scoreBoardName)
    }
    return 0
}

function setScore(scoreBoardName, val) {
    if (!player) {
        world.broadcast("Scoreboard player not defined, setScore() cannot work")
        return
    }
    if (scoreboard.hasPlayerObjective(playerName, scoreBoardName)) {
        scoreboard.setPlayerScore(playerName, scoreBoardName, val)
    }
}

function addToScore(scoreBoardName, val) {
    if (!player) {
        world.broadcast("Scoreboard player not defined, addToScore() cannot work")
        return
    }
    if (scoreboard.hasPlayerObjective(playerName, scoreBoardName)) {
        scoreboard.setPlayerScore(playerName, scoreBoardName, getScore(scoreBoardName) + val)
    }
}

function hasScore(scoreboardName) {
    if (!player) {
        world.broadcast("Scoreboard player not defined, hasScore() cannot work")
        return
    }
    return scoreboard.hasPlayerObjective(playerName, scoreboardName)
}