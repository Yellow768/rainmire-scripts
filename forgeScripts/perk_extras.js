var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
var scoreboard, playerName
var reduce = false
var world = API.getIWorld("overworld")
function tickEventPlayerTickEvent(e) {

    var noppesPlayer = API.getIEntity(e.event.player)
    scoreboard = noppesPlayer.world.getScoreboard()
    playerName = noppesPlayer.name
    if (getScore("using") > 0) {
        switch (reduce) {
            case false:
                reduce = true
                break;
            case true:
                addToScore("perk_power", -1)
                addToScore("using", -1)
                reduce = false
                break;
        }
        if (getScore("using") == 0) {
            reduce = false
        }
    }

    if (noppesPlayer.hasTag("levitating")) {
        noppesPlayer.setMotionY(0)
        noppesPlayer.world.spawnParticle("falling_water", noppesPlayer.x, noppesPlayer.y - 2, noppesPlayer.z, 0.1, .7, 0.1, 1, 50)
        noppesPlayer.world.spawnParticle("bubble_pop", noppesPlayer.x, noppesPlayer.y, noppesPlayer.z, 0.3, .2, 0.3, .01, 100)
        e.event.player.field_70143_R = 0
    }
    if (noppesPlayer.hasTag("isDashing")) {
        var angle = noppesPlayer.getRotation()
        var dx = -Math.sin(angle * Math.PI / 180)
        var dz = Math.cos(angle * Math.PI / 180)
        // noppesPlayer.world.spawnParticle("cloud", noppesPlayer.x, noppesPlayer.y + 1, noppesPlayer.z, 0.1, .1, 0.1, .01, 5)
        noppesPlayer.world.spawnParticle("bubble_pop", noppesPlayer.x - dx, noppesPlayer.y + 1, noppesPlayer.z - dz, 0.1, .1, 0.1, .01, 50)
        noppesPlayer.world.spawnParticle("falling_water", noppesPlayer.x - dx, noppesPlayer.y + 1, noppesPlayer.z - dz, 0.1, .2, 0.1, 1, 5)
    }
    if (noppesPlayer.hasTag("onIcicle")) {
        noppesPlayer.setMotionY(0)
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