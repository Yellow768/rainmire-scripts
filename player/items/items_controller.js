var api = Java.type('noppes.npcs.api.NpcAPI').Instance();

//Boiler

load(api.getLevelDir() + "/scripts/ecmascript/boiler/id_generator.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/commonFunctions.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/scoreboard.js");
load(api.getLevelDir() + "/scripts/ecmascript/boiler/title_generator.js");


//items
load(api.getLevelDir() + "/scripts/ecmascript/player/items/food.js");
load(api.getLevelDir() + "/scripts/ecmascript/player/items/jelly.js");
load(api.getLevelDir() + "/scripts/ecmascript/player/items/lockpicking.js");
load(api.getLevelDir() + "/scripts/ecmascript/player/items/remnant_shard.js");
load(api.getLevelDir() + "/scripts/ecmascript/player/items/throwable_bomb.js");

function init(e) {
    registerScoreboardPlayer(e)
    e.player.tempdata.put("lockpick_function", lockpick_interact)
}

function interact(e) {
    if (jelly_interact(e)) return
    lockpick_interact(e)
    remnantShard_interact(e)
    if (e.player.getMainhandItem().name == "minecraft:pufferfish") {
        summonThrowableBomb(e)
    }
    else if (e.player.getMainhandItem().getFoodLevel() > 0) {
        eatFood(e)
    }
}