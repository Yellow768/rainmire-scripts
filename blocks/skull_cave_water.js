function init(e) {
    if (!e.block.storeddata.has("left_chamber")) {
        e.block.storeddata.put("left_chamber", 0)
        e.block.storeddata.put("right_chamber", 0)
    }
    e.block.getTextPlane().setText("&fSkull Cave Water Level Controller")
}


function tick(e) {
    var level = e.block.storeddata.get("left_chamber") + e.block.storeddata.get("right_chamber")
    var times = [320, 260]
    if (e.block.world.getBlock(5210, 39, 6750).name != "customnpcs:npcscripted" && e.block.storeddata.get("left_chamber") == 0) {

        e.block.storeddata.put("left_chamber", 1)

        e.block.timers.forceStart(1, times[level], false)
        e.block.executeCommand("say " + level)
    }
    if (e.block.world.getBlock(5292, 40, 6730).name != "customnpcs:npcscripted" && e.block.storeddata.get("right_chamber") == 0) {
        e.block.storeddata.put("right_chamber", 1)
        e.block.timers.forceStart(1, times[level], false)
        e.block.executeCommand("say " + level)
    }
}

function timer(e) {
    var level = e.block.storeddata.get("left_chamber") + e.block.storeddata.get("right_chamber")
    if (level == 1) {
        e.block.executeCommand("/fill 5233 23 6733 5279 23 6771 water replace air")
        e.block.executeCommand("say water set")
    }
    if (level == 2) {
        e.block.executeCommand("/fill 5233 26 6733 5279 26 6771 water replace air")
        e.block.executeCommand("say water set")
    }
    e.block.world.playSoundAt(e.block.world.getBlock(5252, 32, 6749).pos, "minecraft:ambient.underwater.exit", 5, 1)
}

function interact(e) {
    e.block.executeCommand("/fill 5233 18 6733 5279 27 6771 air replace water")
    e.block.storeddata.put("left_chamber", 0)
    e.block.storeddata.put("right_chamber", 0)
    e.player.message("Skull Cave water reset")
}