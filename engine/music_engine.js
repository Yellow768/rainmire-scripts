var playing_music = false
var playing_battle_music = false


function tick(e) {
    var currentOpponents = e.player.tempdata.get("currentOpponents")
    if (!playing_battle_music && currentOpponents.length > 0) {
        playing_battle_music = true
        //executeCommand("/stopsound " + e.player.name + " record")
        executeCommand("/playsound iob:music.battle.drums record " + e.player.name + " " + e.player.x + " " + e.player.y + " " + e.player.z + " .2")
    }
    if (playing_battle_music && currentOpponents.length < 1) {
        playing_battle_music = false
        executeCommand("/playsound iob:music.battle.end record " + e.player.name + " " + e.player.x + " " + e.player.y + " " + e.player.z + " .2")
        e.player.timers.start(769150, 22, false)
    }
}

function kill(e) {
    var currentOpponents = e.player.tempdata.get("currentOpponents")
    if (currentOpponents.indexOf(e.entity) != -1) {
        currentOpponents.splice(currentOpponents.indexOf(e.entity), 1)
        e.player.tempdata.put("currentOpponents", currentOpponents)
    }

}

function musicTimer(e) {
    if (e.id == 769150) {
        executeCommand("/stopsound " + e.player.name + " record iob:music.battle.drums")
        //executeCommand("/playsound minecraft:music.under_water record " + e.player.name + " " + e.player.x + " " + e.player.y + " " + e.player.z)
    }
}

