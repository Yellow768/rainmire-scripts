var parent, npc, currentPlayer
var loot = []
var storedItems = []
function init(e) {
    npc = e.npc
    if (e.npc.storeddata.has("storedLoot")) {
        var storedLoot = JSON.parse(e.npc.storeddata.get("storedLoot"))
        e.npc.trigger(2, [storedLoot])
    }
    else {
        e.npc.timers.forceStart(1, 20, false)
    }
}



function trigger(e) {
    if (e.id == 1) {
        parent = e.arguments[0]
        for (var i = 0; i < e.arguments[1].length; i++) {
            loot.push(e.arguments[1][i].copy())
            storedItems.push(loot[i].getItemNbt().toJsonString())
            npc.storeddata.put("storedLoot", JSON.stringify(storedItems))
            npc.storeddata.put("parentsName", parent.name)
        }
    }
    if (e.id == 2) {
        for (var i = 0; i < e.arguments[0].length; i++) {
            var nbt = e.API.stringToNbt(e.arguments[0][i])
            var item = npc.world.createItemFromNbt(nbt)
            loot.push(item)
        }
    }

}

function timer(e) {
    if (e.id == 1) {
        var display = parent.display
        npc.display.setSize(display.getSize())
        npc.display.setTitle(display.name + "'s body")
        npc.display.setName("")

        npc.rotation = parent.rotation
        for (var i = 0; i < 5; i++) {
            npc.display.setModelScale(i, display.getModelScale(i)[0], display.getModelScale(i)[1], display.getModelScale(i)[2])
        }
        npc.updateClient()
        npc.pos = parent.pos
    }
}


function interact(e) {
    if (currentPlayer) {
        e.player.message("&c" + currentPlayer.name + " is currently searching.")
        return
    }
    if (loot == null) {
        e.player.message("DEBUG: Something went wrong, deleting loot instance.")
        e.npc.despawn()
        return
    }
    var lootGUI = e.API.createCustomGui(1, 256, 256, false, e.player)
    var lootX = 96
    var lootY = 22
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            lootGUI.addItemSlot(lootX + (18 * j), lootY + (18 * i))
        }

    }
    var slots = lootGUI.getSlots()
    for (var i = 0; i < loot.length; i++) {
        slots[i].setStack(loot[i])

    }
    lootGUI.setBackgroundTexture("minecraft:textures/gui/demo_background.png")
    lootGUI.showPlayerInventory(lootGUI.getWidth() / 6, 86, true)
    lootGUI.addLabel(90, npc.storeddata.get("parentsName") + "'s body", 5, -10, 1, 1, 16777215)
    e.player.showCustomGui(lootGUI)
    currentPlayer = e.player


}

function customGuiClosed(e) {
    currentPlayer = null
    var slots = e.gui.getSlots()
    var invalidItemFound = false
    storedItems = []
    for (var i = 0; i < slots.length; i++) {
        var validItem = false
        for (var j = 0; j < loot.length; j++) {
            if (slots[i].getStack() == loot[j]) {
                validItem = true

            }
        }
        if (!validItem && slots[i].hasStack()) {
            e.player.giveItem(slots[i].getStack())
            invalidItemFound = true
        }
        if (slots[i].hasStack()) {
            storedItems.push(slots[i].getStack().getItemNbt().toJsonString())
        }


    }
    npc.storeddata.put("storedLoot", JSON.stringify(storedItems))
    if (invalidItemFound) {
        e.player.message("&cItems cannot be stored in loot chests. They've been returned to you")
    }


}
