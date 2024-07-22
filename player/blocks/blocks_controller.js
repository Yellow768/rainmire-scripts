var api = Java.type('noppes.npcs.api.NpcAPI').Instance();

//Boiler

load(api.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/commonFunctions.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/scoreboard.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/title_generator.js");



load(api.getLevelDir() + "/scripts/ecmascript/player/blocks/ancient_interfaces.js");

function interact(e) {
    ancientInterface_interact(e)
}