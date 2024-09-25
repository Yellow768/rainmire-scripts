var api = Java.type('noppes.npcs.api.NpcAPI').Instance();

//Boiler

load(api.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/commonFunctions.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/scoreboard.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/title_generator.js");



load(api.getLevelDir() + '/scripts/ecmascript/boiler/proper_damage.js')

function interact(e) {
}


function tick(e) {
    if (e.player.world.getBlock(e.player.pos).name == "kubejs:thorny_kelp") {
        damageFrom(e.player, e.player, 3)
    }
}