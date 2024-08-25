var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')

var on_script = function (e) { }
var off_script = function (e) { }


function init(e) {
    if (!e.block.storeddata.has("on")) { e.block.storeddata.put("on", 0); e.block.setGeckoTexture("iob:textures/block/ancient_interface_off.png") }
    if (!e.block.storeddata.has("onCommand")) { e.block.storeddata.put("onCommand", "") }
    if (!e.block.storeddata.has("offCommand")) { e.block.storeddata.put("offCommand", "") }
    e.block.setGeckoModel("iob:geo/block/ancient_interface.geo.json")
}


function interact(e) {
    if (e.player.gamemode == 1 && e.player.isSneaking()) {
        openEditingGui(e)
        return
    }

    var on = e.block.storeddata.get("on")
    if (on == 0) {
        e.block.setGeckoTexture("iob:textures/block/ancient_interface_on.png")
        e.block.storeddata.put("on", 1)
        e.block.setLight(10)
        if (e.block.storeddata.get("onCommand") != "") e.block.executeCommand(e.block.storeddata.get("onCommand"))
        on_script(e)
        e.block.executeCommand("/particle minecraft:dust 0 1 1 1 " + (e.block.x + .5) + " " + (e.block.y + 1) + " " + (e.block.z + .5) + " .1 .1 .1 0 50")
        e.block.world.spawnParticle("enchant", e.block.x + .5, e.block.y + 1, e.block.z + .5, .2, .2, .2, 0, 25)
        e.block.world.playSoundAt(e.block.pos, "minecraft:block.beacon.activate", 1, .8)
        return
    }
    else {
        e.block.setGeckoTexture("iob:textures/block/ancient_interface_off.png")
        e.block.storeddata.put("on", 0)
        if (e.block.storeddata.get("offCommand") != "") e.block.executeCommand(e.block.storeddata.get("offCommand"))
        off_script(e)
        e.block.world.spawnParticle("aquamirae:ghost_shine", e.block.x + .5, e.block.y + 1, e.block.z + .5, .2, .2, .2, 0, 5)
        e.block.world.playSoundAt(e.block.pos, "minecraft:block.beacon.deactivate", 1, .6)
        e.block.setLight(5)
    }
}


function openEditingGui(e) {
    var GUI = e.API.createCustomGui(1, 256, 256, false, e.player)
    GUI.addLabel(1, "Ancient Interface Config", 60, -10, 256, 256, 0xffffff)
    GUI.addLabel(2, "Rotation", 0, 30, 256, 256, 0xffffff)
    GUI.addLabel(3, "On Command", 0, 60, 256, 256, 0xffffff)
    GUI.addLabel(4, "Off Command", 0, 90, 256, 256, 0xffffff)

    GUI.addTextField(20, 80, 30, 40, 10).setCharacterType(3).setText(e.block.getRotationX()).setOnChange(function (gui, t) {
        e.block.setRotation(t.getText(), e.block.getRotationY(), e.block.getRotationZ())
    })
    GUI.addTextField(21, 130, 30, 40, 10).setCharacterType(3).setText(e.block.getRotationY()).setOnChange(function (gui, t) {
        e.block.setRotation(e.block.getRotationX(), t.getText(), e.block.getRotationZ())
    })
    GUI.addTextField(22, 180, 30, 40, 10).setCharacterType(3).setText(e.block.getRotationZ()).setOnChange(function (gui, t) {
        e.block.setRotation(e.block.getRotationX(), e.block.getRotationY(), t.getText())
    })

    GUI.addButton(23, "Face Exactly", 230, 5, 90, 20).setHoverText("Rotate the block exactly at you").setOnPress(function (gui, t) {
        try {
            setBlockDirection(e, gui, t, ROTATION_MODES.EXACT)

        }
        catch (error) {
            e.player.message(error)
        }
    })
    GUI.addButton(24, "Face 90", 230, 30, 90, 20).setHoverText("Align block to your closest 90° direction.").setOnPress(function (gui, t) {
        try {
            setBlockDirection(e, gui, t, ROTATION_MODES.CARDINAL)

        }
        catch (error) {
            e.player.message(error)
        }
    })

    GUI.addTextField(30, 80, 60, 260, 10).setText(e.block.getStoreddata().get("onCommand")).setOnChange(function (gui, t) {

        e.block.storeddata.put("onCommand", t.getText())
    })
    GUI.addTextField(40, 80, 90, 260, 10).setText(e.block.getStoreddata().get("offCommand")).setOnChange(function (gui, t) {
        e.block.storeddata.put("offCommand", t.getText())
    })


    e.player.showCustomGui(GUI)
}

var ROTATION_MODES = {
    EXACT: 0,
    CARDINAL: 1
}


var setBlockDirection = function (e, gui, t, mode) {
    switch (mode) {
        case ROTATION_MODES.CARDINAL:
            var v = FrontVectors(e.player, GetAngleTowardsEntity(e.block, e.player), 90, 1, 0)
            var angle = Math.atan2(v[0], v[2])
            var cardinal = Math.round(4 * angle / (2 * Math.PI) + 4) % 4
            var nwse = [
                180,
                270,
                -180,
                90
            ]
            e.block.setRotation(0, nwse[cardinal], 0)
            break;

        case ROTATION_MODES.EXACT:
            e.block.setRotation(0, GetAngleTowardsPosition(e.block.pos, e.player.pos), 0)
            break;
    }
    gui.getComponent(20).setText(e.block.getRotationX())
    gui.getComponent(21).setText(e.block.getRotationY())
    gui.getComponent(22).setText(e.block.getRotationZ())
    gui.update()



}

