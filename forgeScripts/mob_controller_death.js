var API = Java.type('noppes.npcs.api.NpcAPI').Instance();

function livingDamageEvent(e) {
    var entity = API.getIEntity(e.event.entity)
    if (entity.health <= 0 && entity.getTempdata().has("controller_npc")) {
        entity.getTempdata().get("controller_npc").trigger(76801, [entity])
    }
}