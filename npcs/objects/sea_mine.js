var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')
function init(e) {
    if (!e.npc.storeddata.has("y_value")) {
        e.npc.storeddata.put("y_value", e.npc.y)
    }
    if (e.npc.isAlive()) {
        resetMine(e)
        e.npc.timers.forceStart(3, 0, true)
    }
    e.npc.storeddata.remove("exploded")
}
function explode(e) {
    resetMine(e)
    e.npc.display.setVisible(1)
    e.npc.updateClient()
    e.npc.world.explode(e.npc.x, e.npc.y, e.npc.z, e.npc.stats.getAggroRange() + 2, false, false)
    e.npc.world.spawnParticle("alexsmobs:skulk_boom", e.npc.x, e.npc.y + 1, e.npc.z, 0, 0, 0, 0, 1)
    e.npc.world.spawnParticle("aquamirae:ghost_shine", e.npc.x - .5, e.npc.y + 1, e.npc.z - .5, .5, .5, .5, 1, 30)
    e.npc.world.playSoundAt(e.npc.pos, "alexsmobs:sculk_boomer", 1, .2)
    e.npc.world.playSoundAt(e.npc.pos, "alexsmobs:void_portal_open", 1, .2)
    e.npc.timers.stop(1)
    e.npc.setHealth(0)
    e.npc.timers.stop(2)
    e.npc.executeCommand("/setblock ~ ~ ~ water")
}

function interact(e) {
    if (e.player.gamemode == 1) {
        e.npc.storeddata.put("y_value", e.npc.y)
        e.npc.say("Y Value set")
    }
}


function died(e) {
    explode(e)
}

function collide(e) {
    if (e.entity.type == 1 && e.entity.gamemode == 1) return
    if (TrueDistanceCoord(e.npc.x, e.npc.y, e.npc.z, e.entity.x, e.entity.y, e.entity.z) > 1.4) return
    e.npc.kill()
}

function timer(e) {
    if (e.id == 1) {
        e.npc.kill()
    }

    if (e.id == 2) {

        if (!detectIfEntitiesInRange(e, e.npc.stats.getAggroRange() + 1)) {
            resetMine(e)
            e.npc.world.playSoundAt(e.npc.pos, "alexsmobs:void_portal_open", 1, 2)
            e.npc.timers.stop(2)
            e.npc.executeCommand("/stopsound @a[distance=..30] * alexsmobs:void_portal_close")
        }
    }
    if (e.id == 3) {
        if (!e.npc.timers.has(1) && detectIfEntitiesInRange(e, e.npc.stats.getAggroRange()) && e.npc.isAlive()) {
            e.npc.timers.forceStart(1, 60, false)
            e.npc.timers.forceStart(2, 0, true)
            var builder = e.API.createAnimBuilder()
            builder.thenLoop("animation.sea_mine.spin")
            e.npc.syncAnimationsForAll(builder)
            e.npc.world.playSoundAt(e.npc.pos, "alexsmobs:void_portal_close", 1, .6)
            e.npc.world.playSoundAt(e.npc.pos, "minecraft:block.beacon.deactivate", 1, .6)
            e.npc.executeCommand("/setblock ~ ~ ~ minecraft:light[level=10,waterlogged=true]")
        }
    }
}
function resetMine(e) {
    var builder = e.API.createAnimBuilder()
    builder.thenLoop("animation.sea_mine.idle")
    e.npc.syncAnimationsForAll(builder)
    e.npc.timers.stop(1)
    if (e.npc.world.getBlock(e.npc.x, e.npc.y, e.npc.z).name != "minecraft:water") {
        e.npc.executeCommand("/setblock ~ ~ ~ minecraft:light[level=5,waterlogged=true]")
    }
    e.npc.display.setVisible(0)
    e.npc.y = e.npc.storeddata.get("y_value")

}
function detectIfEntitiesInRange(e, range) {
    var nE = e.npc.world.getNearbyEntities(e.npc.pos, range, 5)
    if (nE.length > 1) {
        for (var i = 0; i < nE.length; i++) {
            if (nE[i] != e.npc && nE[i].name != "Ancient Sea Mine" && e.npc.canSeeEntity(nE[i])) {
                if (nE[i].type == 1 && nE[i].gamemode == 1) continue
                return true
            }
        }
    }
    return false
}