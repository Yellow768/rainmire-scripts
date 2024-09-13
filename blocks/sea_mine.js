var block
var range = 4
var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')
function init(e) {
    block = e.block
    e.block.storeddata.put("sea_mine", 1)
    e.block.setGeckoAnimationFile("iob:animations/sea_mine_animations.json")
    if (!e.block.timers.has(4)) {
        resetMine(e)
        e.block.timers.forceStart(3, 0, true)
    }
}
function explode() {
    if (block.timers.has(4)) return
    block.setGeckoTexture("iob:textures/skins/empty.png")
    block.world.explode(block.x, block.y, block.z, range + 2, false, false)
    block.world.spawnParticle("alexsmobs:skulk_boom", block.x, block.y + 1, block.z, 0, 0, 0, 0, 1)
    block.world.spawnParticle("aquamirae:ghost_shine", block.x - .5, block.y + 1, block.z - .5, .5, .5, .5, 1, 30)
    block.world.playSoundAt(block.pos, "alexsmobs:sculk_boomer", 1, .2)
    block.world.playSoundAt(block.pos, "alexsmobs:void_portal_open", 1, .2)
    block.timers.stop(1)
    block.timers.stop(2)
    block.timers.forceStart(4, 200, false)
    block.setIsPassible(true)
    block.setLight(0)

    for (var x = -range; x <= range; x++) {
        for (var z = -range; z <= range; z++) {
            for (var y = -range; y <= range; y++) {
                var check_block = block.world.getBlock(block.x + x, block.y + y, block.z + z)
                if (check_block.storeddata.has("sea_mine") && check_block != block) {
                    check_block.trigger(1, [])
                }
            }
        }
    }
}

function trigger(e) {
    if (e.id == 1) {
        explode()
    }
}

function collide(e) {
    if (e.block.timers.has(4)) return
    if (e.entity.type == 1 && e.entity.gamemode == 1) return
    explode()
}

function timer(e) {
    if (e.id == 1) {
        explode()
    }

    if (e.id == 2) {

        if (!detectIfEntitiesInRange(e, range + 2)) {
            resetMine(e)
            e.block.world.playSoundAt(e.block.pos, "alexsmobs:void_portal_open", 1, 2)
            e.block.timers.stop(2)
            e.block.executeCommand("/stopsound @a[distance=..30] * alexsmobs:void_portal_close")
        }
    }
    if (e.id == 3) {
        if (!e.block.timers.has(1) && detectIfEntitiesInRange(e, range) && !e.block.timers.has(4)) {
            e.block.timers.forceStart(1, 60, false)
            e.block.timers.forceStart(2, 0, true)
            var builder = e.API.createAnimBuilder()
            builder.thenLoop("animation.sea_mine.spin")
            e.block.syncAnimForAll(builder)
            e.block.world.playSoundAt(e.block.pos, "alexsmobs:void_portal_close", 1, .6)
            e.block.world.playSoundAt(e.block.pos, "minecraft:block.beacon.deactivate", 1, .6)
            e.block.setGeckoIdleAnimation("animation.sea_mine.spin")
            e.block.setLight(13)
        }
    }
    if (e.id == 4) {
        resetMine(e)
    }
}
function resetMine(e) {
    e.block.setGeckoModel("iob:geo/sea_mine.geo.json")
    e.block.setGeckoTexture("iob:textures/skins/sea_mine.png")
    e.block.setGeckoIdleAnimation("animation.sea_mine.idle")
    var builder = e.API.createAnimBuilder()
    builder.thenLoop("animation.sea_mine.idle")
    e.block.syncAnimForAll(builder)
    e.block.timers.stop(1)
    e.block.setIsPassible(false)

    e.block.setLight(7)
}
function detectIfEntitiesInRange(e, range) {
    var nE = e.block.world.getNearbyEntities(e.block.pos, range, 5)
    if (nE.length > 0) {
        for (var i = 0; i < nE.length; i++) {
            if (nE[i].type == 1 && nE[i].gamemode == 1) continue
            if (nE[i].type == 2 && (nE[i].getFaction().getId() == 4 || nE[i].getFaction().getId() == 5)) continue
            return true
        }
    }
    return false
}