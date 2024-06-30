
var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(API.getLevelDir() + "/scripts/ecmascript/player_mechanics/powers/dash.js");
load(API.getLevelDir() + "/scripts/ecmascript/player_mechanics/powers/groundpound.js");
load(API.getLevelDir() + "/scripts/ecmascript/player_mechanics/powers/levitate.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/commonFunctions.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");



var isMovingBackwards
var isMovingForward
var isMovingLeft
var isMovingRight
var reduce = false

function powers_init(e) {
    e.player.timers.forceStart(id("check_for_groundpound"), 0, true)
}


function powers_timers(e) {
    dash_timers(e)
    groundpound_timers(e)
    levitate_timers(e)
    if (e.id == id("hydration_depletion_delta")) {
        depleteHydrationWithDelta(e)
    }
    if (e.id == id("hydration_replenishing")) {
        replenishHydrationIfInWater(e)
    }
    if (e.id == id("REHYDRATE_TIMER")) {
        setScore("restore_hydrate", 0)
    }
}




function powers_keyPressed(e) {
    var keyBinds = JSON.parse(e.player.world.storeddata.get(e.player.name + "keyBindsJSON"))
    if (e.key == 87) { isMovingForward = true }
    if (e.key == 65) { isMovingLeft = true }
    if (e.key == 83) { isMovingBackwards = true }
    if (e.key == 68) { isMovingRight = true }
    e.player.timers.forceStart(id("hydration_depletion_delta"), 0, true)
    switch (e.key) {
        case keyBinds.key_dash:
            dash(e)
            break;
        case 341:
            groundpound(e)
            break;
        case keyBinds.key_levitate:
            if (isOnGround(e.player) || e.player.inWater() || e.player.gamemode == 1) return
            prevY = e.player.y
            executeCommand("tp " + e.player.name + " " + e.player.x + " " + e.player.y + " " + e.player.z)
            e.player.timers.forceStart(id("levitate_timer"), 20, true)
            e.player.timers.forceStart(id("levitate_particles_timer"), 0, true)
            levitate(e)
            break;
    }

}


function powers_keyReleased(e) {
    var keyBinds = JSON.parse(e.player.world.storeddata.get(e.player.name + "keyBindsJSON"))
    if (e.key == 87) { isMovingForward = false }
    if (e.key == 65) { isMovingLeft = false }
    if (e.key == 83) { isMovingBackwards = false }
    if (e.key == 68) { isMovingRight = false }
    if (e.key == keyBinds.key_levitate) {
        deactivateLevitation(e)
    }
}



function attemptToUseHydration(e, cost) {
    if (e.player.hasTag("conservationist") && getScore("good_perk_debt") >= getScore("bad_perk_debt")) {
        cost = Math.floor(cost / 2)
    }
    if (e.player.gamemode == 1) {
        return true
    }
    if ((getScore("perk_power") - getScore("using")) < cost) {
        if (e.player.hasTag("blood_cost")) {
            var cdamage = cost - getScore("perk_power")
            if (getScore("perk_power") > 0) {
                addToScore("using", getScore("perk_power"))
            }
            e.player.damage(cdamage / 2)
            e.player.world.spawnParticle("falling_lava", e.player.x, e.player.y + 1, e.player.z, .3, .4, .3, 1, 200)
            e.player.playSound("upgrade_aquatic:entity.pike.death", 1, 1)
            return true
        }
        displayNotEnoughpower(e, cost)
        return false
    }
    addToScore("using", cost)


    return true
}

function displayNotEnoughpower(e) {
    e.player.world.spawnParticle("supplementaries:air_burst", e.player.x, e.player.y, e.player.z, .4, .2, .4, .07, 8)
    e.player.world.spawnParticle("minecraft:squid_ink", e.player.x, e.player.y, e.player.z, .2, .2, .2, .07, 4)
    e.player.world.playSoundAt(e.player.pos, "minecraft:entity.puffer_fish.sting", .4, 1)
    e.player.world.playSoundAt(e.player.pos, "minecraft:entity.guardian.hurt", .4, 1)
    executeCommand('/title ' + e.player.name + ' actionbar {"text":"Not Enough Water!","bold":true,"italic":true,"color":"#D060A8"}')
}


function depleteHydrationWithDelta(e) {
    if (getScore("using") > 0) {
        switch (reduce) {
            case false:
                reduce = true
                break;
            case true:
                addToScore("perk_power", -1)
                addToScore("using", -1)
                reduce = false
                break;
        }
        if (getScore("using") == 0) {
            reduce = false
        }
    }
}

var currentReplensihingLevel = 0
function replenishHydrationIfInWater(e) {
    var perkReplenishingThreshold
    if (e.player.inWater()) {
        if (e.player.world.getBiomeName(e.player.x, e.player.z) == "minecraft:ocean") {
            perkReplenishingThreshold = 15
        }
        else {
            perkReplenishingThreshold = 15
        }
        currentReplensihingLevel++
        if (currentReplensihingLevel >= perkReplenishingThreshold && getScore("perk_power") < getScore("max_perk_power")) {
            addToScore("perk_power", 1)
            currentReplensihingLevel = 0
            setScore("restore_hydrate", 1)
            e.player.timers.forceStart(id("REHYDRATE_TIMER"), 4, false)
        }
    }
}