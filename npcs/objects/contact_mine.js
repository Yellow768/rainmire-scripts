var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')

function init(e) {
    if (!e.npc.storeddata.has("y_value")) {
        e.npc.storeddata.put("y_value", e.npc.y)
    }
}

function collide(e) {
    if (e.entity.name == "Contact Sea Mine") return
    if (e.entity.type == 1 && e.entity.gamemode == 1) return
    if (TrueDistanceEntities(e.npc, e.entity) > 1.15) return
    e.npc.kill()
}

function tick(e) {
    if (e.npc.storeddata.has("y_value") && e.npc.ai.getNavigationType() == 1) {
        e.npc.y = e.npc.storeddata.get("y_value")
    }
}

function interact(e) {
    if (e.player.gamemode == 1) {
        if (e.npc.storeddata.has("y_value")) {
            e.npc.storeddata.remove("y_value")
            e.player.message("removed y value")
            return
        }
        if (!e.npc.storeddata.has("y_value")) {
            e.player.message("placed y value")
            e.npc.storeddata.put("y_value", e.npc.y)
        }
    }
}

function died(e) {
    e.npc.world.explode(e.npc.x, e.npc.y, e.npc.z, e.npc.stats.getAggroRange(), false, false)
}