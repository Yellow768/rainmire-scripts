function toggleEvergrowBoat(e) {
    if (!getScore("evergrowBoat")) {
        return
    }
    if (deleteBoat(e, true)) {
        e.player.timers.stop(768201)
        return
    }
    if (getScore("perk_power") > 0) {
        addToScore("using", 1)
        summonEvergrowBoat(e)
    }

}

function findNearbyBoats(e) {
    var nE = e.player.world.getNearbyEntities(e.player.pos, 80, -1)
    var nearbyBoats = []
    if (nE.length == 0) {
        return nearbyBoats
    }
    for (var i = 0; i < nE.length; i++) {
        if (nE[i].hasTag(e.player.name)) {
            nearbyBoats.push(nE[i])
        }
    }
    return nearbyBoats
}

function deleteBoat(e, correctUUID) {
    var nearbyBoats = findNearbyBoats(e)
    var doesUUIDMatch
    var result = false
    if (nearbyBoats.length < 1) {

        return result

    }
    for (var i = 0; i < nearbyBoats.length; i++) {
        doesUUIDMatch = (nearbyBoats[i].getUUID() == e.player.tempdata.get("BoatUUID"))
        if (doesUUIDMatch == correctUUID) {
            nearbyBoats[i].kill()
            result = true
            e.player.world.spawnParticle("minecraft:sneeze", nearbyBoats[i].x, nearbyBoats[i].y + 2, nearbyBoats[i].z, 2, 1, 2, .2, 50)
            e.player.world.spawnParticle("minecraft:dragon_breath", nearbyBoats[i].x, nearbyBoats[i].y, nearbyBoats[i].z, .5, 1, .5, .2, 50)
            e.player.world.playSoundAt(nearbyBoats[i].pos, "minecraft:entity.puffer_fish.sting", 1, 1)
        }
    }
    return result
}

function summonEvergrowBoat(e) {
    var rayTrace = e.player.rayTraceBlock(10, true, true)
    var pos = e.player.pos
    if (rayTrace != null) {
        pos = rayTrace.getPos()
    }


    executeCommand('/summon boat ' + pos.x + " " + (pos.y + 2) + " " + pos.z + ' {Glowing:1b,Invulnerable:1b,CustomNameVisible:1b,Type:"dark_oak",Tags:["' + e.player.name + '"],CustomName:\'{"text":"' + e.player.name + '`s Evergrow Boat","color":"green","bold":true}\'}')
    var nE = e.player.world.getNearbyEntities(e.player.pos, 8, -1)
    for (var i = 0; i < nE.length; i++) {
        if (nE[i].hasTag(e.player.name) && nE[i].getUUID() != e.player.tempdata.get("BoatUUID")) {
            e.player.tempdata.put("BoatUUID", nE[i].getUUID())
            e.player.timers.forceStart(768201, 60, true)
        }
    }
    e.player.world.playSoundAt(e.player.pos, "minecraft:block.beehive.enter", 1, 1)
    e.player.world.playSoundAt(e.player.pos, "minecraft:block.wet_grass.break", 1, 1)
    e.player.world.playSoundAt(e.player.pos, "minecraft:entity.shulker_bullet.hurt", 1, 1)
    e.player.world.spawnParticle("minecraft:sneeze", pos.x, pos.y + 2, pos.z, 2, 1, 2, .2, 50)
    executeCommand('/title ' + e.player.name + ' times 0 20 20')
    executeCommand('/title ' + e.player.name + ' actionbar {"text":"Evergrow Boat Summoned","italic":true,"color":"green"}')
    executeCommand('/title ' + e.player.name + ' title {"text":"","bold":true,"color":"yellow"}')
}