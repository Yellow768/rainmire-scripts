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
var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");

var FunctionTypes = {
    attack: 1,
    break: 2,
    damagedEntity: 3,
    died: 4,
    init: 5,
    interact: 6,
    kill: 7,
    tick: 8,
    rangedLaunched: 9

}


var perk_idea = {
    name: "Sword Master",
    cost: 3,
    tag: "swrdmster"
}




function init(e) {

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
    setUpVals(e)
    e.player.timers.forceStart(PERK_VISUAL_FEEDBACK_TIMER, 0, true)

}

function trigger(e) {
    if (e.id == 200) /*Establish Perk Arays*/ {
        selected_powers = JSON.parse(player.storeddata.get("selected_powers"))
        selected_dampeners = JSON.parse(player.storeddata.get("selected_dampeners"))
        collected_powers = JSON.parse(player.storeddata.get("collected_powers"))
        collected_dampeners = JSON.parse(player.storeddata.get("collected_dampeners"))
    }
    if (e.id == 210) /*Grant New Perk*/ {
        if (eval("good_perks." + e.arguments[0]) != undefined) {
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


    if (e.id == 220) /*Grant New Bad Perk*/ {
        if (eval("dampening_perks." + e.arguments[0]) != undefined) {
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

function timer(e) {


}







function keyPressed(e) {

}


function keyReleased(e) {

}

function executePerk(e, index) {

}



function disablePerk(e, index) {

}














function tick(e) {


}



function interact(e) {

}

function damaged(e) {

}

function damagedEntity(e) {

}

function rangedLaunched(e) {
    if (e.player.hasTag("bow_malfunction")) {
        if (Math.random() < .25) {
            e.setCanceled(true)
            e.player.playSound("quark:entity.toretoise.hurt", 1, 1)
            displayTitle(e, "Your finger slipped!", '#E441C3')
            summonArrowInFrontOfPlayer(e)
            e.player.removeItem("arrow", 1)
        }
    }
    if (e.player.hasTag("perfectAimActive")) perfect_aim_ranged_launched(e)

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
