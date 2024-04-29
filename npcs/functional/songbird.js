var npc, GUI

function init(e) {
    if (!e.npc.storeddata.has("potion")) {
        e.npc.storeddata.put("potion", 1)
    }
    npc = e.npc
    e.npc.timers.forceStart(1, 20, true)
}

function interact(e) {
    if (e.player.isSneaking() && e.player.gamemode == 1) {
        GUI = e.API.createCustomGui(1, 256, 256, false, e.player)
        GUI.addLabel(3, "Potion Effect ID", 20, 50, 1, 1, 167255)
        GUI.addTextField(2, 130, 50, 200, 15)
            .setCharacterType(1)
            .setInteger(e.npc.storeddata.get("potion"))
        GUI.addButton(4, "Save", 50, 90, 50, 20)
        e.player.showCustomGui(GUI)

    }
}

function customGuiButton(e) {
    npc.storeddata.put("potion", GUI.getComponent(2).getText())
    e.player.closeGui()
}

function timer(e) {
    var nE = e.npc.world.getNearbyEntities(e.npc.pos, 20, 1)
    if (nE.length > 0) {
        var sing = false
        for (var i = 0; i < nE.length; i++) {
            if (nE[i].getPotionEffect(e.npc.storeddata.get("potion")) != 0) {
                nE[i].addPotionEffect(e.npc.storeddata.get("potion"), 600, 0, false)
                sing = true
            }

        }
        if (sing) { e.npc.world.playSoundAt(e.npc.pos, "minecraft:entity.dolphin.play", 1, 1); e.npc.executeCommand("/particle minecraft:note") }
    }
}

