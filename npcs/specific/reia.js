var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/scoreboard.js')

var GUI
var player
var npc

function tick(e) {
    if (getScore("rafari_reia", "global") == 1) {
        e.npc.despawn()
    }
}

function dialog(e) {
    if (e.dialog.id == 810) {
        e.API.getClones().spawn(796, 109, 1264, "ReiaInterface", 5, e.npc.world)
        e.npc.despawn()
    }
    if (e.dialog.id == 849) {
        var interface_block = e.npc.world.getBlock(798, 110, 1264)
        interface_block.trigger(3)
    }
}

function dialogOption(e) {
    if (e.dialog.id == 806 && e.option.getSlot() == 0) {
        GUI = e.API.createCustomGui(1, 256, 256, false, e.player)
        GUI.setBackgroundTexture("minecraft:textures/gui/demo_background.png")
        GUI.addItemSlot(117, 30)
        GUI.showPlayerInventory(45, 80)
        GUI.addLabel(1, "Weapon must do 5 hearts of damage", 40, 60, 1, 1, 0xffffff)
        GUI.addLabel(2, "Offer a weapon to Reia", 70, 10, 1, 1, 0xffffff)
        e.npc.timers.start(777, 2, false)
        player = e.player
        npc = e.npc
    }
}

function timer(e) {
    if (e.id == 777) {
        player.showCustomGui(GUI)
    }
}

var returnItem = true

function customGuiSlot(e) {
    if (e.stack.getAttackDamage() > 4) {
        GUI.addButton(4, "Offer", 140, 28, 50, 20).setOnPress(function (gui, t) {
            returnItem = false
            player.closeGui()
            player.message("yeah")
            npc.despawn()
            player.showDialog(814, "Reia")

        })
        GUI.update()
    }
    else if (GUI.getComponent(4)) {
        GUI.removeComponent(4)
        GUI.update()
    }
}

/**
 * @param {CustomGuiEvent.CloseEvent} e
 */
function customGuiClosed(e) {
    if (!returnItem) return
    var slots = GUI.getSlots()
    if (slots[0].hasStack()) {
        e.player.giveItem(slots[0].getStack())
    }
}