var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')
function collide(e) {
    if (e.entity.name == "Contact Sea Mine") return

    e.npc.kill()
}



function died(e) {
    e.npc.world.explode(e.npc.x, e.npc.y, e.npc.z, e.npc.stats.getAggroRange(), false, false)
}