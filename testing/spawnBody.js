var droppedItems
var currentBody
function init(e) {
    e.npc.display.setHitboxState(0)
    if (currentBody) {
        currentBody.despawn()
        currentBody = null
    }
    if (e.npc.storeddata.has("lootBodyID")) {
        var entities = e.npc.world.getNearbyEntities(e.npc.pos, 10, 2)
        for (var npc = 0; npc < entities.length; npc++) {
            if (entities[npc].getUUID() == e.npc.storeddata.get("lootBodyID")) {
                entities[npc].despawn()
                e.npc.storeddata.remove("lootBodyID")
            }
        }
    }
}

function died(e) {
    var body = e.API.clones.get(1, "Dead Body", e.npc.world)
    e.npc.world.spawnEntity(body)
    droppedItems = e.droppedItems
    e.npc.timers.start(1, 1, false)
    body.trigger(1, [e.npc, e.droppedItems])
    body.pos = e.npc.pos.up(1)
    body.updateClient()
    e.npc.display.setHitboxState(1)
    currentBody = body
    e.npc.storeddata.put("lootBodyID", currentBody.getUUID())
}

function timer(e) {
    var items = e.npc.world.getNearbyEntities(e.npc.pos, 20, 6)
    for (var i = 0; i < items.length; i++) {
        for (var j = 0; j < droppedItems.length; j++) {
            if (items[i].getItem().getItemNbt().isEqual(droppedItems[j].getItemNbt())) {
                items[i].despawn()

            }
        }
    }
}