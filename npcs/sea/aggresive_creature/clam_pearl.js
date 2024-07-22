var isClosed = false
var npc
function init(e) {
    e.npc.timers.forceStart(10, getRandomInt(20, 80), false)
    e.npc.timers.forceStart(15, 15, true)
    npc = e.npc
}



function timer(e) {
    if (e.id == 10 && e.npc.health > 0) {
        e.npc.executeCommand("/particle minecraft:firework ~ ~2 ~ 2 .6 2 0 40 force")
        e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.glow_squid.ambient", 2, .5)

        e.npc.timers.forceStart(10, getRandomInt(20, 180), false)
    }
    if (e.id == 15) {
        e.npc.executeCommand("/particle minecraft:bubble_column_up ~ ~ ~ .2 1 .2 0 10 force")
        var players = e.npc.world.getNearbyEntities(e.npc.pos, 3, 1)
        if (players.length > 0) {
            if (!isClosed && !e.npc.timers.has(20) && !e.npc.timers.has(30)) {
                e.npc.timers.start(20, 65, false)
            }

        }
        if (isClosed) {
            for (var i = 0; i < players.length; i++) {
                players[i].addPotionEffect(20, 1, 1, false)
            }
            e.npc.executeCommand("/particle minecraft:dust 0 1 0 2 ~ ~1 ~ 2 .4 2 0 100 force")
            e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.glow_squid.squirt", 2, .6)
        }
    }
    if (e.id == 20) {
        isClosed = true
        e.npc.executeCommand("/setblock " + e.npc.storeddata.get("rx") + " " + e.npc.storeddata.get("ry") + " " + e.npc.storeddata.get("rz") + " minecraft:redstone_block")
        e.npc.timers.forceStart(25, getRandomInt(100, 220), false)
        e.npc.world.playSoundAt(e.npc.pos, "block.chest.close", 1, .1)
        e.npc.world.playSoundAt(e.npc.pos, "aquamirae:entity.deep_ambient", 1, .7)
        e.npc.timers.start(21, 1, false)


    }
    if (e.id == 21) {
        e.npc.executeCommand("/setblock " + e.npc.storeddata.get("rx") + " " + e.npc.storeddata.get("ry") + " " + e.npc.storeddata.get("rz") + " minecraft:air")
    }
    if (e.id == 25) {
        isClosed = false
        e.npc.executeCommand("/setblock " + e.npc.storeddata.get("rx") + " " + e.npc.storeddata.get("ry") + " " + e.npc.storeddata.get("rz") + " minecraft:redstone_block")
        e.npc.timers.start(21, 1, false)
        e.npc.world.playSoundAt(e.npc.pos, "block.chest.open", 1, .1)
        e.npc.timers.start(30, 60, false)

    }
}

function died(e) {
    e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.glow_squid.squirt", 1, 1)
    e.npc.executeCommand("/particle minecraft:firework ~ ~ ~ .4 .4 .4 1 100")
    e.npc.executeCommand("/particle minecraft:campfire_cosy_smoke ~ ~ ~ .2 .2 .2 1 100")
    e.npc.timers.stop(10)
    e.npc.timers.stop(15)
    e.npc.timers.stop(20)
    e.npc.timers.stop(25)
    if (isClosed) {
        e.npc.executeCommand("/setblock " + e.npc.storeddata.get("rx") + " " + e.npc.storeddata.get("ry") + " " + e.npc.storeddata.get("rz") + " minecraft:redstone_block")
        isClosed = false
    }

}


function interact(e) {
    if (e.player.tempdata.has("clamNPCConfig")) {
        e.player.tempdata.remove("clamNPCConfig")
        e.player.message("Config canceled.")
    }
    else if (e.player.gamemode == 1 && !e.player.tempdata.has("clamNPCConfig") && (e.player.name == "Yellow768" || e.player.name == "FireUS")) {
        e.player.tempdata.put("clamNPCConfig", e.npc)
        e.player.message("Right click a block to select it as the redstone location for this clam")
    }

}

function trigger(e) {
    if (e.id == 1) {
        npc.storeddata.put("rx", e.arguments[0].x)
        npc.storeddata.put("ry", e.arguments[0].y)
        npc.storeddata.put("rz", e.arguments[0].z)
    }
}