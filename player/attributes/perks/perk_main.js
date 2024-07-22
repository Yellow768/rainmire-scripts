var doPerks = false
var perkReplenishingThreshold = 5
var currentReplensihingLevel = 0


var selected_powers = {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null
}
var collected_powers = []
var selected_dampeners = {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null
}
var collected_dampeners = []

var player
var reduce = false
load(api.getLevelDir() + "/scripts/ecmascript/player/attributes/perks/perfect_aim.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/entity_shoot.js");



function perks_init(e) {
    player = e.player


    if (!e.player.storeddata.has("selected_powers")) {
        e.player.storeddata.put("selected_powers", JSON.stringify(selected_powers))
        e.player.storeddata.put("collected_powers", "[]")
        e.player.storeddata.put("selected_dampeners", JSON.stringify(selected_dampeners))
        e.player.storeddata.put("collected_dampeners", "[]")
    }
    selected_powers = JSON.parse(e.player.storeddata.get("selected_powers"))
    selected_dampeners = JSON.parse(e.player.storeddata.get("selected_dampeners"))
    collected_powers = JSON.parse(e.player.storeddata.get("collected_powers"))
    collected_dampeners = JSON.parse(e.player.storeddata.get("collected_dampeners"))

    e.player.storeddata.put("selected_powers", JSON.stringify(selected_powers))
    e.player.storeddata.put("selected_dampeners", JSON.stringify(selected_dampeners))
    e.player.storeddata.put("collected_powers", JSON.stringify(collected_powers))
    e.player.storeddata.put("collected_dampeners", JSON.stringify(collected_dampeners))
    registerPerks()

}


function registerPerks() {
    attackFuncs = []
    damagedEntityFuncs = []
    damagedFuncs = []
    diedFuncs = []
    initFuncs = []
    interactFuncs = []
    killFuncs = []
    tickFuncs = []
    rangedLaunchedFuncs = []
    selected_powers = JSON.parse(player.storeddata.get("selected_powers"))
    selected_dampeners = JSON.parse(player.storeddata.get("selected_dampeners"))
    collected_powers = JSON.parse(player.storeddata.get("collected_powers"))
    collected_dampeners = JSON.parse(player.storeddata.get("collected_dampeners"))
    var tags = []
    for (var i = 0; i < 5; i++) {
        if (selected_powers[i] == null) continue
        var current_perk = good_perks[selected_powers[i]]

        if (getScore("good_perk_debt") <= getScore("bad_perk_debt") || player.storeddata.has("ignorePerkDebt")) {
            addPerksFunctionToArray(current_perk)
            if (current_perk.tag != "") {
                tags.push(current_perk.tag)
            }
        }

    }
    for (var i = 0; i < 5; i++) {
        if (selected_dampeners[i] == null) continue
        var current_perk = dampening_perks[selected_dampeners[i]]
        addPerksFunctionToArray(current_perk)
        if (current_perk.tag != "") {
            tags.push(current_perk.tag)
        }
    }
    player.tempdata.put("perk_tags", tags)
}


function addPerksFunctionToArray(current_perk) {
    switch (current_perk.event) {
        case EventFunctions.init:
            initFuncs.push(current_perk.func)
            break
        case EventFunctions.tick:
            tickFuncs.push(current_perk.func)
            break
        case EventFunctions.damagedEntity:
            damagedEntityFuncs.push(current_perk.func)
            break
        case EventFunctions.rangedLaunched:
            rangedLaunchedFuncs.push(current_perk.func)
            break
        case EventFunctions.died:
            diedFuncs.push(current_perk.func)
            break
        case EventFunctions.kill:
            killFuncs.push(current_perk.func)
            break
        case EventFunctions.attack:
            attackFuncs.push(current_perk.func)
            break
        case EventFunctions.damaged:
            damagedFuncs.push(current_perk.func)
            break

    }
}

function perks_trigger(e) {
    if (e.id == id("grant_new_perk")) /*Grant New Perk*/ {
        if (good_perks[e.arguments[0]] != undefined) {
            if (collected_powers.indexOf(e.arguments[0]) != -1) {
                player.message("&eYou have already found this power")
                return
            }
            collected_powers.push(e.arguments[0])
            player.storeddata.put("collected_powers", JSON.stringify(collected_powers))
            return
        }
        player.message(e.arguments[0] + " does not exist")
    }


    if (e.id == id("grant_new_dampener")) /*Grant New Bad Perk*/ {
        if (dampening_perks[e.arguments[0]] != undefined) {
            if (collected_dampeners.indexOf(e.arguments[0]) != -1) {
                player.message("&5You have already found this dampening perk")
                return
            }
            collected_dampeners.push(e.arguments[0])
            player.storeddata.put("collected_dampeners", JSON.stringify(collected_dampeners))
            return

        }
        player.message(e.arguments[0] + " does not exist or the player already has this perk. No perk was added")
    }
    if (e.id == 20) {
        removeNpcFromArray(e, e.arguments[0])
    }
    if (e.id == id("send_wave_slice")) {
        player.world.playSoundAt(player.pos, "minecraft:entity.boat.paddle_water", 1, 2)
        player.world.playSoundAt(player.pos, "minecraft:entity.generic.splash", .1, 1)
        player.world.playSoundAt(player.pos, "customnpcs:misc.swosh", .2, 2)
        for (var i = -1; i < 2; i++) {
            var d = FrontVectors(player, 30 * i, 0, 1, 1)
            var proj_data = {
                x: player.x + d[0],
                y: player.y + 1.3,
                z: player.z + d[2],
                itemid: "blue_dye",
                power: 5,
                punch: 2,
                gravity: 0,
                deviation: 0,
                size: 15,
                render3d: 0,
                pitch: player.pitch,
                rotation: player.rotation,
                speed: 2
            }
            var water_projectile = entityShoot(player, proj_data)
            water_projectile.addTag("water")
            water_projectile.getWorld().spawnParticle("minecraft:falling_water", water_projectile.x, water_projectile.y, water_projectile.z, .5, 0, .5, 1, 100)
            all_water_projectiles.push(water_projectile)
            player.timers.forceStart(id("water_wave_particles"), 0, true)
            try {
                water_projectile.enableEvents()
            } catch (e) {

            }
        }
    }
}


function doesNotHavePerk(perk) {
    for (var i = 0; i < collected_powers.length; i++) {
        if (collected_powers[i].id == perk.id) {
            return false
        }
    }
    for (var i = 0; i < collected_dampeners.length; i++) {
        if (collected_dampeners[i].id == perk.id) {
            return false
        }
    }
    return true
}


function executePerkFunction(e, eventFunction) {
    for (var i = 0; i < eventFunction.length; i++) {
        eventFunction[i](e)
    }
}


function perks_timer(e) {
    perfect_aim_timers(e)
    if (e.id == id("water_wave_particles")) {
        for (var i = 0; i < all_water_projectiles.length; i++) {
            all_water_projectiles[i].world.spawnParticle("minecraft:falling_water", all_water_projectiles[i].x, all_water_projectiles[i].y, all_water_projectiles[i].z, .5, 0, .5, 1, 60)
        }
    }
}

function perks_damagedEntity(e) {
    executePerkFunction(e, damagedEntityFuncs)
}

function perks_tick(e) {
    executePerkFunction(e, tickFuncs)

}

function perks_interact(e) {
    executePerkFunction(e, interactFuncs)
}

function perks_damaged(e) {
    executePerkFunction(e, damagedFuncs)
}



function perks_kill(e) {
    executePerkFunction(e, killFuncs)
}

function perks_attack(e) {
    executePerkFunction(e, attackFuncs)
}

function perks_rangedLaunched(e) {
    executePerkFunction(e, rangedLaunchedFuncs)

}
function summonArrowInFrontOfPlayer(e) {
    var angle = e.player.getRotation()
    var dx = -Math.sin(angle * Math.PI / 180)
    var dz = Math.cos(angle * Math.PI / 180)
    var dy = -Math.tan(e.player.getPitch() / 90)
    var pitch = (90 - (Math.abs(e.player.getPitch()))) * 0.011
    if (dy < 0) {
        dy = 0
    }
    var x = e.player.x + (dx * pitch)
    var y = e.player.y + 1 + dy
    var z = e.player.z + (dz * pitch)
    executeCommand("summon arrow " + x + " " + y + " " + z + " {pickup:1}")
}


/**
 * @param {ProjectileEvent.UpdateEvent} e
 */
function projectileTick(e) {
    if (e.projectile.hasTag("water")) {
        if (!e.projectile.storeddata.has("ttl")) { e.projectile.storeddata.put("ttl", 0) }
        //  e.projectile.storeddata.put("ttl", e.projectile.storeddata.get("ttl") + 1)
        if (e.projectile.storeddata.get("ttl") == 0) { e.projectile.world.spawnParticle("minecraft:bubble_pop", e.projectile.x, e.projectile.y, e.projectile.z, .5, 0, .5, 0, 100); all_water_projectiles.splice(all_water_projectiles.indexOf(e.projectile), 1); e.projectile.despawn(); }

    }
}

function projectileImpact(e) {
    if (e.projectile.hasTag("water")) {
        e.projectile.world.spawnParticle("minecraft:bubble_pop", e.projectile.x, e.projectile.y, e.projectile.z, .5, 0, .5, 0, 100)
        all_water_projectiles.splice(all_water_projectiles.indexOf(e.projectile), 1)
    }
}