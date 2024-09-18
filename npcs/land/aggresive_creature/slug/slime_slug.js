var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/land/aggresive_creature/slug/slug_base.js')


var effect_id = 2

var color_rgb = [0, 1, 0, 1]
var color_name = "green"

global_functions.init = function (e) {
    e.npc.timers.forceStart(50, 2, true)
}

function visualSlugEffects(e) {
    e.npc.world.spawnParticle("upgrade_aquatic:green_jelly_blob", npc.x + .5, npc.y, npc.z + .5, .1, .1, .1, 0, 1)
    e.npc.world.spawnParticle("item_slime", npc.x + .5, npc.y, npc.z + .5, .1, .1, .1, 0, 1)
}


