
var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
var world = api.getIWorld("minecraft:overworld")
var scoreboard = world.getScoreboard()
var playerName
var player






function registerScoreboardPlayer(e) {

    player = e.player
    playerName = e.player.name
}

function getScore(scoreBoardName, name) {
    if (!name && player) {
        name = player.name
    }
    if (!player && !name) {
        world.broadcast("Scoreboard player not defined, getScore() cannot work")
        return
    }
    if (scoreboard.hasPlayerObjective(name, scoreBoardName)) {
        return scoreboard.getPlayerScore(name, scoreBoardName)
    }
    return 0
}

function setScore(scoreBoardName, val, name) {
    if (!name && player) {
        name = player.name
    }
    if (!player && !name) {
        world.broadcast("Scoreboard player not defined, setScore() cannot work")
        return
    }

    scoreboard.setPlayerScore(name, scoreBoardName, val)

}

function addToScore(scoreBoardName, val, name) {
    if (!name && player) {
        name = player.name
    }
    if (!player && !name) {
        world.broadcast("Scoreboard player not defined, addToScore() cannot work")
        return
    }
    if (scoreboard.hasPlayerObjective(name, scoreBoardName)) {
        scoreboard.setPlayerScore(name, scoreBoardName, getScore(scoreBoardName, name) + val)
    }
}

function hasScore(scoreboardName, name) {
    if (!name && player) {
        name = player.name
    }
    if (!player && !name) {
        world.broadcast("Scoreboard player not defined, hasScore() cannot work")
        return
    }
    return scoreboard.hasPlayerObjective(name, scoreboardName)
}