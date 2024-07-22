var noVelocity = -0.0784000015258789
var groundPounding = false
var flyingUp = false
var initialY = 0
var jumpBoostLevel = -1



function groundpound(e) {
    var cost = 3

    if (groundPounding) {
        return
    }
    if (flyingUp || player.getMotionY() == noVelocity || player.inWater()) {
        return
    }
    if (!attemptToUseHydration(4)) {
        return
    }
    flyingUp = true
    //player.world.spawnParticle("minecraft:bubble_pop", player.x, player.y + 1, player.z, .4, .2, .4, 0, 300)
    //player.world.spawnParticle("minecraft:falling_water", player.x, player.y + 1, player.z, .1, .1, .1, 0, 300)
    player.world.playSoundAt(player.pos, "variedcommodities:magic.charge", .2, 1)
    player.world.playSoundAt(player.pos, "minecraft:entity.dolphin.splash", 1, 1)
    if (player.getPotionEffect(8) != -1) {
        jumpBoostLevel = player.getPotionEffect(8)
        executeCommand("effect clear " + player.name + " jump_boost")
    }
    startDownwardMotion(e)
    player.timers.forceStart(id("groundpound_validity_timer"), 0, true)
    player.timers.stop(id("dash_visual_effects"))
    e.player.timers.forceStart(id("prevent_groundpound_falldamage"), 40, false)
    e.player.addTag("gpIgnoreDamage")

}


function groundpound_timers(e) {
    if (e.id == id("groundpound_delay")) {
        groundpound(e)
    }
    if (e.id == id("groundpound_validity_timer")) {
        player.world.spawnParticle("minecraft:bubble_pop", player.x, player.y - 1, player.z, 0.1, 0.5, 0.1, 0, 150)
        if (isGroundPoundValid(e)) {
            activateGroundPound(e)
        }
    }
    if (e.id == id("groundpound_npc_particles")) {

        if (!player.tempdata.has("gpnpcparticleindex")) { player.tempdata.put("gpnpcparticleindex", 0) }

        var index = player.tempdata.get("gpnpcparticleindex")
        var gpnpcs = player.tempdata.get("groundpound_npcs")
        for (var i = 0; i < gpnpcs.length; i++) {
            gpnpcs[i].world.spawnParticle("cloud", gpnpcs[i].x, gpnpcs[i].y, gpnpcs[i].z, .2, .2, .2, 0, 10)
        }
        index += 1
        player.tempdata.put("gpnpcparticleindex", index)
        if (player.tempdata.get("gpnpcparticleindex") > 10) {
            player.timers.stop(id("groundpound_npc_particles"))
            player.tempdata.remove("gpnpcparticleindex")
        }
        else {
            player.timers.forceStart(id("groundpound_npc_particles"), 2, false)
        }
    }
    if (e.id == id("prevent_groundpound_falldamage")) {
        e.player.removeTag("gpIgnoreDamage")
    }
}

function startDownwardMotion(e) {
    player.world.playSoundAt(player.pos, "variedcommodities:magic.shot", 1, 1)
    player.setMotionY(-4)
    groundPounding = true
    initialY = player.y
}

function isGroundPoundValid(e) {
    return isOnGround(player) || player.inWater()

}


function activateGroundPound(e) {
    if (jumpBoostLevel > -1) {
        player.addPotionEffect(8, 25555, jumpBoostLevel, true)
        jumpBoostLevel = -1
    }
    var distance = initialY - player.y
    if (distance < 0) {
        distance = 1
    }


    var nNPCS = player.world.getNearbyEntities(player.pos, distance + 2, -1)
    player.tempdata.put("groundpound_npcs", nNPCS)
    for (var i = 0; i < nNPCS.length; i++) {
        var current_npc = nNPCS[i]
        if ((nNPCS[i].type == 2 && player.factionStatus(nNPCS[i].getFaction().getId()) != 1) || (nNPCS[i] != player && nNPCS[i].gamemode != 1)) {
            var knockback = distance + 2
            var vertKnockback = distance / 4
            if (knockback > 3) knockback = 3
            if (vertKnockback > 1) vertKnockback = 1
            nNPCS[i].damage(distance * 2.5)
            DoKnockback(player, nNPCS[i], knockback, vertKnockback)
            player.world.playSoundAt(player.pos, "customnpcs:misc.swosh", 1, .5)
            player.world.playSoundAt(player.pos, "minecraft:entity.player.attack.crit", 1, 1)
            current_npc.world.spawnParticle("crit", current_npc.x, current_npc.y, current_npc.z, .5, .5, .5, 0.2, 200)
            if (nNPCS[i].name == "Burrower") {
                nNPCS[i].trigger(1, [])
            }
            player.timers.forceStart(id("groundpound_npc_particles"), 0, true)
        }
    }

    if (distance < 6) {
        player.world.playSoundAt(player.pos, "minecraft:entity.player.splash", 1, 1)
    }
    else {
        player.world.playSoundAt(player.pos, "minecraft:entity.player.splash.high_speed", 1, 1)
    }

    var radius = distance + 2
    flyingUp = false
    groundPounding = false
    //player.world.spawnParticle("minecraft:cloud", player.x, player.y - 1, player.z, radius / 4, .02, radius / 4, .5, 20 * distance)
    player.world.playSoundAt(player.pos, "supplementaries:item.bomb", 1, 1)

    var Thread = Java.type("java.lang.Thread"); var HankThread = Java.extend(Thread, {
        run: function () {
            for (var j = 0; j < radius; j += .5) {
                e.API.executeCommand(player.world, "/particle dust 1 1 1 .6 " + player.x + " " + (player.y + .5) + " " + player.z + " " + j + " " + 0 + " " + j + " 0 10")
                e.API.executeCommand(player.world, "/particle falling_water " + player.x + " " + (player.y + .5) + " " + player.z + " " + j + " " + 0 + " " + j + " 0 100")
                spawnCircularParticles(player.world, "minecraft:crit", j, .2, 1, player.x, player.y - .7, player.z)
                e.API.executeCommand(player.world, "/particle block dirt " + player.x + " " + (player.y) + " " + player.z + " " + (j - 1) + " " + 0 + " " + (j - 1) + " 0 100")
                Thread.sleep(30)
                if (j > 4) {
                    j += 2
                }
            }


        }
    }); var H = new HankThread(); H.start();
    player.damage(0.0000001)
    e.player.timers.stop(id("groundpound_validity_timer"))

}



function damaged(e) {
    if (e.player.hasTag("gpIgnoreDamage") && e.damageSource.type == "fall") {
        if (player.getMCEntity().f_19789_ < 15) {
            e.setCanceled(true)
        }
    }
}
