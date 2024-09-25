var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/scoreboard.js')
function redstone(e) {
    if (e.power == 0) return
    e.block.timers.forceStart(1, 60, false)
}

function timer(e) {
    var level_ys = commands_array[getScore("shilo_level", "shilo_dungeon")]
    if (e.id == 1) {
        if (getScore("shilo_level", "shilo_dungeon") == 0) {
            var nP = e.block.world.getNearbyEntities(e.block.pos, 60, 1)
            for (var i = 0; i < nP.length; i++) {
                nP[i].startQuest(12)
                e.API.getQuests().get(12).getObjectives(nP[i])[0].setProgress(1)
            }
        }
        else {
            var nP = e.block.world.getNearbyEntities(e.block.pos, 60, 1)
            for (var i = 0; i < nP.length; i++) {
                e.API.getQuests().get(12).getObjectives(nP[i])[0].setProgress(getScore("shilo_level", "shilo_dungeon"))
            }
        }
        e.block.executeCommand("/fill 1544 " + level_ys.top + " 2552 1653 " + level_ys.top + " 2659 water replace air")
        e.block.timers.start(2, 40, false)
    }
    if (e.id == 2) {
        e.block.executeCommand("/fill 1545 " + level_ys.top + " 2552 1653 " + level_ys.bottom + " 2659 water replace air")
        e.block.executeCommand("/fill 1545 " + level_ys.top + " 2552 1653 " + level_ys.bottom + " 2659 water replace water")
        addToScore("shilo_level", 1, "shilo_dungeon")
    }
}


var commands_array = [
    {
        top: 3,
        bottom: -3
    },
    {
        top: 10,
        bottom: 4
    },
    {
        top: 23,
        bottom: 10
    }

]