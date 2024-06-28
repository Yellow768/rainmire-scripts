var noVelocity = -0.0784000015258789
var groundPounding = false
var flyingUp = false
var initialY = 0
var jumpBoostLevel = -1

function perk_groundpound(e, cost) {
    var cost = 3

    if (groundPounding) {
        return
    }
    if (flyingUp || e.player.getMotionY() == noVelocity) {
        return
    }
    if (!attemptToUsePerkPower(e, cost)) {
        return
    }
    flyingUp = true

    //e.player.world.spawnParticle("minecraft:bubble_pop", e.player.x, e.player.y + 1, e.player.z, .4, .2, .4, 0, 300)
    //e.player.world.spawnParticle("minecraft:falling_water", e.player.x, e.player.y + 1, e.player.z, .1, .1, .1, 0, 300)
    e.player.world.playSoundAt(e.player.pos, "variedcommodities:magic.charge", .2, 1)
    e.player.world.playSoundAt(e.player.pos, "minecraft:entity.dolphin.splash", 1, 1)
    if (e.player.getPotionEffect(8) != -1) {
        jumpBoostLevel = e.player.getPotionEffect(8)
        executeCommand("effect clear " + e.player.name + " jump_boost")
    }
    startDownwardMotion(e)
    e.player.timers.forceStart(GROUNDPOUND_VALIDITY_TIMER, 0, true)

}


function groundpound_timers(e) {
    if (e.id == GROUNDPOUND_VALIDITY_TIMER) {
        e.player.world.spawnParticle("minecraft:bubble_pop", e.player.x, e.player.y - 1, e.player.z, 0.1, 0.5, 0.1, 0, 150)
        if (isGroundPoundValid(e)) {
            activateGroundPound(e)
        }
    }
    if (e.id == id("groundpound_npc_particles")) {

        if (!e.player.tempdata.has("gpnpcparticleindex")) { e.player.tempdata.put("gpnpcparticleindex", 0) }

        var index = e.player.tempdata.get("gpnpcparticleindex")
        var gpnpcs = e.player.tempdata.get("groundpound_npcs")
        for (var i = 0; i < gpnpcs.length; i++) {
            gpnpcs[i].world.spawnParticle("cloud", gpnpcs[i].x, gpnpcs[i].y, gpnpcs[i].z, .2, .2, .2, 0, 10)
        }
        index += 1
        e.player.tempdata.put("gpnpcparticleindex", index)
        if (e.player.tempdata.get("gpnpcparticleindex") > 10) {
            e.player.timers.stop(id("groundpound_npc_particles"))
            e.player.tempdata.remove("gpnpcparticleindex")
        }
        else {
            e.player.timers.forceStart(id("groundpound_npc_particles"), 2, false)
        }
    }
}

function startDownwardMotion(e) {

    e.player.world.playSoundAt(e.player.pos, "variedcommodities:magic.shot", 1, 1)
    e.player.setMotionY(-4)
    groundPounding = true
    initialY = e.player.y
}

function isGroundPoundValid(e) {
    return isOnGround(e.player) || e.player.inWater()

}


function activateGroundPound(e) {
    if (jumpBoostLevel > -1) {
        e.player.addPotionEffect(8, 25555, jumpBoostLevel, true)
        jumpBoostLevel = -1
    }
    var distance = initialY - e.player.y
    if (distance < 0) {
        distance = 1
    }


    var nNPCS = e.player.world.getNearbyEntities(e.player.pos, distance + 2, -1)
    e.player.tempdata.put("groundpound_npcs", nNPCS)
    for (var i = 0; i < nNPCS.length; i++) {
        var current_npc = nNPCS[i]
        if ((nNPCS[i].type == 2 && e.player.factionStatus(nNPCS[i].getFaction().getId()) != 1) || (nNPCS[i] != e.player)) {
            var knockback = distance + 2
            var vertKnockback = distance / 4
            if (knockback > 3) knockback = 3
            if (vertKnockback > 1) vertKnockback = 1
            nNPCS[i].damage(distance * 2.5)
            DoKnockback(e.player, nNPCS[i], knockback, vertKnockback)
            e.player.world.playSoundAt(e.player.pos, "customnpcs:misc.swosh", 1, .5)
            e.player.world.playSoundAt(e.player.pos, "minecraft:entity.player.attack.crit", 1, 1)
            current_npc.world.spawnParticle("crit", current_npc.x, current_npc.y, current_npc.z, .5, .5, .5, 0.2, 200)
            if (nNPCS[i].name == "Burrower") {
                nNPCS[i].trigger(1, [])
            }
            e.player.timers.forceStart(id("groundpound_npc_particles"), 0, true)
        }
    }

    if (distance < 6) {
        e.player.world.playSoundAt(e.player.pos, "minecraft:entity.player.splash", 1, 1)
    }
    else {
        e.player.world.playSoundAt(e.player.pos, "minecraft:entity.player.splash.high_speed", 1, 1)
    }

    var radius = distance + 2
    flyingUp = false
    groundPounding = false
    //e.player.world.spawnParticle("minecraft:cloud", e.player.x, e.player.y - 1, e.player.z, radius / 4, .02, radius / 4, .5, 20 * distance)
    e.player.world.playSoundAt(e.player.pos, "supplementaries:item.bomb", 1, 1)

    var Thread = Java.type("java.lang.Thread"); var HankThread = Java.extend(Thread, {
        run: function () {
            for (var j = 0; j < radius; j += .5) {
                e.API.executeCommand(e.player.world, "/particle dust 1 1 1 .6 " + e.player.x + " " + (e.player.y + .5) + " " + e.player.z + " " + j + " " + 0 + " " + j + " 0 10")
                e.API.executeCommand(e.player.world, "/particle falling_water " + e.player.x + " " + (e.player.y + .5) + " " + e.player.z + " " + j + " " + 0 + " " + j + " 0 100")
                spawnCircularParticles(e.player.world, "minecraft:crit", j, .2, 1, e.player.x, e.player.y - .7, e.player.z)
                e.API.executeCommand(e.player.world, "/particle block dirt " + e.player.x + " " + (e.player.y) + " " + e.player.z + " " + (j - 1) + " " + 0 + " " + (j - 1) + " 0 100")
                Thread.sleep(30)
                if (j > 4) {
                    j += 2
                }
            }


        }
    }); var H = new HankThread(); H.start();
    e.player.damage(0.0000001)
    e.player.timers.stop(GROUNDPOUND_VALIDITY_TIMER)
}




