var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
function livingEquipmentChangeEvent(e) {
    var forgeEntity = e.event.entity
    var noppesEntity = API.getIEntity(forgeEntity)

    if (noppesEntity.type == 1) {
        var fromItem = API.getIItemStack(e.event.getFrom())
        var toItem = API.getIItemStack(e.event.getTo())
        noppesEntity.trigger(1, [noppesEntity, fromItem, toItem, e.event.getSlot()])
    }
}

function worldOut(text) {
    return API.getIWorld("overworld").broadcast(text);
}


