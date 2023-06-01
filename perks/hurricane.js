function perk_hurricane(e, cost) {
    var block = e.player.rayTraceBlock(25, true, true)
    if (block == null) {
        executeCommand('/title ' + e.player.name + ' actionbar {"text":"Too far!","color":"red"}')
        e.player.world.playSoundAt(e.player.pos, "minecraft:entity.guardian.hurt", .4, 1)
        return
    }
    if (!attemptToUsePerkPower(e, cost)) {
        return
    }
    e.player.tempdata.put("hurricane_block", block.pos)
    e.player.timers.forceStart(HURRICANE_TIMER, 90, true)
    e.player.timers.forceStart(HURRICANE_TIMER_EFFECT, 2, true)
    e.player.world.playSoundAt(e.player.tempdata.get("hurricane_block"), "minecraft:item.elytra.flying", 1, 1)
    e.player.world.playSoundAt(e.player.tempdata.get("hurricane_block"), "minecraft:weather.rain", 1, 1)
    e.player.world.playSoundAt(e.player.tempdata.get("hurricane_block"), "minecraft:block.bubble_column.whirlpool_inside", 1, 1)
    executeCommand("/particle minecraft:dust .2 .5 1 3 " + e.player.tempdata.get("hurricane_block").x + " " + e.player.tempdata.get("hurricane_block").y + " " + e.player.tempdata.get("hurricane_block").z + " 2 6 2 .5 100")

    e.player.addTag("hurricaneActive")

}

function hurricaneEffects(e) {
    if (e.player.tempdata.get("hurricane_block") == null) {
        e.player.timers.stop(HURRICANE_TIMER)
        e.player.timers.stop(HURRICANE_TIMER_EFFECT)
        return
    }
    e.player.tempdata.put("hurricane_block", e.player.tempdata.get("hurricane_block").offset(Math.floor(2 + Math.random() * 3), 1))
    if (e.player.pos.distanceTo(e.player.tempdata.get("hurricane_block").up(5)) > 25) {
        e.player.removeTag("hurricaneActive")
    }
    if (e.player.hasTag("hurricaneActive")) {
        e.player.world.spawnParticle("sweep_attack", e.player.tempdata.get("hurricane_block").x, e.player.tempdata.get("hurricane_block").y, e.player.tempdata.get("hurricane_block").z, 3, 7, 3, 1, 50)
        e.player.world.playSoundAt(e.player.tempdata.get("hurricane_block"), "minecraft:weather.rain", 1, 1)
        var nE = e.player.world.getNearbyEntities(e.player.tempdata.get("hurricane_block"), 10, -1)

        for (var i = 0; i < nE.length; i++) {
            if (nE[i].type == 1) {
                if (nE[i].world.getBlock(nE[i].pos.down(1)).name != "minecraft:air") {
                    break;
                }
            }
            nE[i].world.playSoundAt(nE[i].pos, "variedcommodities:magic.shot", 1, 1)
            knockbackEntity(nE[i], e.player.tempdata.get("hurricane_block"), -3)
            nE[i].setMotionY(Math.random())
        }
        for (var i = 6; i > 0; i--) {
            var position = e.player.tempdata.get("hurricane_block").up(i)

            spawnCircularParticles(e, "cloud", (i) / 2, 1, .6, position.down(0.5))
            spawnCircularParticles(e, "hurricane", (i) / 2, 1, .6, position.down(1))
            e.player.world.spawnParticle("falling_water", position.x, position.y, position.z, 1.5, 1.5, 1.5, .5, 40)
        }
    }


}