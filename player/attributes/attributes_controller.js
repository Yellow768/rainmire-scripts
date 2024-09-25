var api = Java.type('noppes.npcs.api.NpcAPI').Instance();

//Boiler

load(api.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/commonFunctions.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/scoreboard.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/title_generator.js");
load(api.getLevelDir() + "/scripts/ecmascript/player/attributes/perks/perks.js");

//Scripts for this container

load(api.getLevelDir() + "/scripts/ecmascript/player/attributes/aqua_upgrade_gui.js");

load(api.getLevelDir() + "/scripts/ecmascript/player/attributes/attributes_gui.js");
load(api.getLevelDir() + "/scripts/ecmascript/player/attributes/perks/perk_main.js");
load(api.getLevelDir() + "/scripts/ecmascript/player/attributes/attributes.js");

function init(e) {
    registerScoreboardPlayer(e)
    attributes_init(e)
    perks_init(e)
    if (!e.player.storeddata.has("checked_dialogs")) e.player.storeddata.put("checked_dialogs", '{"0": "[]"}')
}

function login(e) {
    justLoggedIn = true
    e.player.timers.start(1001, 10, false)
}

function timer(e) {
    perks_timer(e)
    attributes_timer(e)
    attributeCheck_timer(e)
}
function damagedEntity(e) {
    perks_damagedEntity(e)
}

function tick(e) {
    perks_tick(e)

}

function interact(e) {
    perks_interact(e)
}

function damaged(e) {
    perks_damaged(e)
}



function kill(e) {
    perks_kill(e)
}

function attack(e) {
    perks_attack(e)
}

function rangedLaunched(e) {
    perks_rangedLaunched(e)

}

function trigger(e) {
    perks_trigger(e)
    attributes_trigger(e)
}


function customGuiButton(e) {
    attributes_customGuiButton(e)
}