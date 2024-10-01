var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')
function init(e) {
    if (!e.block.storeddata.has("model")) {
        e.block.storeddata.put("model", "oak_door")
        e.block.storeddata.put("open_sound", "minecraft:block.wooden_door.open")
        e.block.storeddata.put("close_sound", "minecraft:block.wooden_door.close")
    }
    e.block.setBlockModel(e.block.storeddata.get("model"))
}

function doorToggle(e) {
    if (e.block.getOpen()) {
        e.block.world.playSoundAt(e.block.pos, e.block.storeddata.get("open_sound"), 1, getRandomFloat(.8, 1.2))
    }
    else {
        e.block.world.playSoundAt(e.block.pos, e.block.storeddata.get("close_sound"), 1, getRandomFloat(.8, 1.2))
    }
}

function interact(e) {
    if (e.player.gamemode == 1 && e.player.isSneaking()) {
        openDoorSettingsGUI(e)
    }
}


function openDoorSettingsGUI(e) {
    var GUI = e.API.createCustomGui(1, 256, 256, false, e.player)
    GUI.addLabel(2, "Door Settings", 128, 0, 1, 1, 0xffffff)
    GUI.addLabel(3, "Model", 0, 20, 1, 1, 0xffffff)
    GUI.addLabel(4, "Open Sound", 0, 40, 1, 1, 0xffffff)
    GUI.addLabel(5, "Close Sound", 0, 60, 1, 1, 0xffffff)
    GUI.addTextField(33, 70, 15, 120, 15)
        .setText(e.block.storeddata.get("model"))
        .setOnChange(function (gui, t) {
            e.block.storeddata.put("model", t.getText())
        })
    GUI.addTextField(44, 70, 35, 120, 15)
        .setText(e.block.storeddata.get("open_sound"))
        .setOnChange(function (gui, t) {
            e.block.storeddata.put("open_sound", t.getText())
        })
    GUI.addTextField(55, 70, 55, 120, 15)
        .setText(e.block.storeddata.get("close_sound"))
        .setOnChange(function (gui, t) {
            e.block.storeddata.put("close_sound", t.getText())
        })
    e.player.showCustomGui(GUI)
}