var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/npcs/land/aggresive_creature/slug/slug_base.js')


var effect_id = 17

var color_rgb = [1, 0, 0, 1]
var color_name = "red"

global_functions.init = function (e) {
    e.npc.timers.forceStart(50, 2, true)
}

function visualSlugEffects(e) {
    e.npc.world.spawnParticle("upgrade_aquatic:red_jelly_blob", npc.x + .5, npc.y, npc.z + .5, .1, .1, .1, 0, 1)
    e.npc.world.spawnParticle("flame", npc.x + .5, npc.y, npc.z + .5, .1, .1, .1, 0, 1)
}



global_functions.timer = function (e) {
    if (e.id == 50) {
        var nE = e.npc.world.getNearbyEntities(e.npc.pos, 20, 5)
        for (var i = 0; i < nE.length; i++) {
            if (nE[i] != e.npc && nE[i].getPotionEffect(17) != -1 && nE[i].name != "Fire Slug") {
                nE[i].setBurning(40)
            }
        }
    }
}