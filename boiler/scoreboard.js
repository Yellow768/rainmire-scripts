var scoreboard
var playerName
var player

function init(e) {
    setUpVals(e)
}

function setUpVals(e) {
    scoreboard = e.player.world.getScoreboard()
    player = e.player
    playerName = e.player.name
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