
var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(API.getLevelDir() + "/scripts/ecmascript/player/powers/dash.js");
load(API.getLevelDir() + "/scripts/ecmascript/player/powers/groundpound.js");
load(API.getLevelDir() + "/scripts/ecmascript/player/powers/levitate.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/commonFunctions.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/scoreboard.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");
load(API.getLevelDir() + "/scripts/ecmascript/boiler/spawnCircularParticles.js");



var isMovingBackwards
var isMovingForward
var isMovingLeft
var isMovingRight
var reduce = false
var player

function init(e) {
    player = e.player
    e.player.timers.forceStart(id("check_for_groundpound"), 0, true)
    e.player.timers.forceStart(id("updateHydrationData"), 0, true)
    e.player.timers.forceStart(id("hydration_replenishing"), 0, true)
    e.player.timers.forceStart(id("hydration_depletion_delta"), 0, true)
    e.player.timers.forceStart(id("REHYDRATE_TIMER"), 0, true)
    registerScoreboardPlayer(e)
}


function timer(e) {
    if (e.id == id("updateHydrationData")) {
        updateHydrationData()
    }
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




function keyPressed(e) {
    if (e.openGui) return
    var keyBinds = JSON.parse(e.player.storeddata.get("keyBindsJSON"))
    if (e.key == 87) { isMovingForward = true }
    if (e.key == 65) { isMovingLeft = true }
    if (e.key == 83) { isMovingBackwards = true }
    if (e.key == 68) { isMovingRight = true }
    player.timers.forceStart(id("hydration_depletion_delta"), 0, true)
    switch (e.key) {
        case keyBinds.key_dash:
            dash(e)
            break;
        case 86:
            if (player.gamemode == 3) return
            groundpound(e)
            deactivateLevitation(e)
            break;
        case keyBinds.key_levitate:
            if (isOnGround(player) || e.player.inWater() || player.gamemode != 2) return
            if (player.gamemode == 1) return
            prevY = player.y
            player.timers.forceStart(id("levitate_timer"), 20, true)
            player.timers.forceStart(id("levitate_particles_timer"), 0, true)
            player.timers.forceStart(id("levitate_float_timer"), 0, true)
            player.timers.forceStart(id("levitate_check_invalid_timer"), 0, true)
            levitate(e)
            break;
    }

}


function keyReleased(e) {
    var keyBinds = JSON.parse(e.player.storeddata.get("keyBindsJSON"))
    if (e.key == 87) { isMovingForward = false }
    if (e.key == 65) { isMovingLeft = false }
    if (e.key == 83) { isMovingBackwards = false }
    if (e.key == 68) { isMovingRight = false }
    if (e.key == keyBinds.key_levitate) {
        deactivateLevitation(e)
    }
}



function attemptToUseHydration(cost) {
    if (player.storeddata.get("infiniteHydration") == 1) return true
    if (player.hasTag("conservationist") && getScore("good_perk_debt") >= getScore("bad_perk_debt")) {
        cost = Math.floor(cost / 2)
    }
    if (player.gamemode == 1) {
        return true
    }
    if ((getScore("perk_power") - getScore("using")) < cost) {
        if (player.tempdata.get("perk_tags").indexOf("blood_cost") != -1) {
            var cdamage = cost - getScore("perk_power")
            if (getScore("perk_power") - (getScore("using")) > 0) {
                addToScore("using", getScore("perk_power") - (getScore("using")))
            }
            player.damage(cdamage / 2)
            player.world.spawnParticle("falling_lava", player.x, player.y + 1, player.z, .3, .4, .3, 1, 200)
            player.playSound("upgrade_aquatic:entity.pike.death", 1, 1)
            return true
        }
        displayNotEnoughpower(cost)
        return false
    }
    addToScore("using", cost)


    return true
}

function displayNotEnoughpower() {
    player.world.spawnParticle("supplementaries:air_burst", player.x, player.y, player.z, .4, .2, .4, .07, 8)
    player.world.spawnParticle("minecraft:squid_ink", player.x, player.y, player.z, .2, .2, .2, .07, 4)
    player.world.playSoundAt(player.pos, "minecraft:entity.puffer_fish.sting", .4, 1)
    player.world.playSoundAt(player.pos, "minecraft:entity.guardian.hurt", .4, 1)
    executeCommand('/title ' + player.name + ' actionbar {"text":"Not Enough Water!","bold":true,"italic":true,"color":"#D060A8"}')
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
    if (e.player.getMCEntity().m_20070_() /* Obf Method, isInRainOrWater*/) {
        if (e.player.world.getBiomeName(e.player.x, e.player.z) == "minecraft:ocean") {
            perkReplenishingThreshold = 15
        }
        else {
            perkReplenishingThreshold = 8
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

function trigger(e) {
    if (e.id == id("remoteUseHydration")) {
        if (attemptToUseHydration(e.arguments[0])) { player.trigger(e.arguments[1], []) }
    }
}

function updateHydrationData(e) {
    player.nbt.setInteger("hydration", getScore("perk_power"))
    player.nbt.setInteger("max_hydration", getScore("max_perk_power"))
    player.nbt.setInteger("delta", getScore("using"))
    player.nbt.setInteger("breath", getScore("breath"))
    player.nbt.setInteger("restoring", getScore("restore_hydrate"))
}