var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/commonFunctions.js')

var on_script = function (e) { }
var off_script = function (e) { }

var block
function init(e) {
    if (!e.block.storeddata.has("on")) { e.block.storeddata.put("on", 0); e.block.setGeckoTexture("iob:textures/block/ancient_interface_off.png") }
    if (!e.block.storeddata.has("onCommand")) { e.block.storeddata.put("onCommand", "") }
    if (!e.block.storeddata.has("offCommand")) { e.block.storeddata.put("offCommand", "") }
    if (!e.block.storeddata.has("onlyOnce")) { e.block.storeddata.put("onlyOnce", 0) }
    if (!e.block.storeddata.has("cooldown")) { e.block.storeddata.put("cooldown", 0) }
    if (!e.block.storeddata.has("defaultState")) { e.block.storeddata.put("defaultState", 0) }
    if (!e.block.storeddata.has("powerline_pos_array")) { e.block.storeddata.put("powerline_pos_array", JSON.stringify([])) }
    e.block.setGeckoModel("iob:geo/block/ancient_interface.geo.json")
    block = e.block
}


function interact(e) {
    if (e.player.gamemode == 1 && e.player.isSneaking()) {
        openEditingGui(e)
        return
    }
    if (e.block.timers.has(500)) { e.player.playSound("quark:block.pipe.pickup", .2, .2); return }
    var on = e.block.storeddata.get("on")
    if (on == 0 && !e.block.storeddata.get("Activated")) {
        e.block.setGeckoTexture("iob:textures/block/ancient_interface_on.png")
        e.block.storeddata.put("on", 1)
        e.block.setLight(10)
        e.block.executeCommand("/particle minecraft:dust 0 1 1 1 " + (e.block.x + .5) + " " + (e.block.y + 1) + " " + (e.block.z + .5) + " .1 .1 .1 0 50")
        e.block.world.spawnParticle("enchant", e.block.x + .5, e.block.y + 1, e.block.z + .5, .2, .2, .2, 0, 25)
        e.block.world.playSoundAt(e.block.pos, "minecraft:block.beacon.activate", 1, .8)
        if (!e.block.storeddata.get("Activated")) {
            if (e.block.storeddata.get("onCommand") != "") e.block.executeCommand(e.block.storeddata.get("onCommand"))
            on_script(e)
        }
        if (e.block.storeddata.get("onlyOnce")) e.block.storeddata.put("Activated", 1)
        e.block.timers.start(500, e.block.storeddata.get("cooldown"), false)
        setPowerLineState(!on)
        return
    }
    else if (on == 1 && !e.block.storeddata.get("Activated")) {
        e.block.setGeckoTexture("iob:textures/block/ancient_interface_off.png")
        e.block.storeddata.put("on", 0)
        if (!e.block.storeddata.get("Activated")) {
            if (e.block.storeddata.get("offCommand") != "") e.block.executeCommand(e.block.storeddata.get("offCommand"))
            off_script(e)
        }
        if (e.block.storeddata.get("onlyOnce")) e.block.storeddata.put("Activated", 1)

        e.block.world.spawnParticle("aquamirae:ghost_shine", e.block.x + .5, e.block.y + 1, e.block.z + .5, .2, .2, .2, 0, 5)
        e.block.world.playSoundAt(e.block.pos, "minecraft:block.beacon.deactivate", 1, .6)
        e.block.setLight(5)
        e.block.timers.start(500, e.block.storeddata.get("cooldown"), false)
        setPowerLineState(!on)
    }
}




function setPowerLineState(on) {
    var powerline_pos_array = JSON.parse(block.storeddata.get("powerline_pos_array"))
    for (var i = 0; i < powerline_pos_array.length; i++) {
        block.executeCommand("/setblock " + powerline_pos_array[i].x + " " + powerline_pos_array[i].y + " " + powerline_pos_array[i].z + " quark:blue_crystal_lamp[lit=" + on + "]")
    }
}

function openEditingGui(e) {
    e.player.tempdata.remove("setting_powerline_interface")
    e.block.storeddata.put("Activated", 0)
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

    GUI.addTextField(50, 80, 120, 90, 10).setText(e.block.storeddata.get("cooldown")).setOnChange(function (gui, t) { e.block.storeddata.put("cooldown", t.getText()) }).setHoverText("Cooldown between interacts")

    var onlyOnceLabel = ["False", "True"]
    GUI.addButton(60, "False", 80, 150, 100, 25).setLabel(onlyOnceLabel[e.block.getStoreddata().get("onlyOnce")]).setOnPress(function (gui, t) {
        switch (e.block.storeddata.get("onlyOnce")) {
            case 0:
                t.setLabel("True")
                e.block.storeddata.put("onlyOnce", 1)
                break;
            case 1:
                t.setLabel("False")
                e.block.storeddata.put("onlyOnce", 0)
                break;
        }
        GUI.update()
    }).setHoverText("Toggle if commands are activated every time, or only once.")
    GUI.addLabel(61, "Activate Once", 0, 155, 1, 1, 0xffffff)
    GUI.addLabel(51, "Cooldown", 0, 122, 1, 1, 0xffffff)


    GUI.addButton(81, "Edit Power Line", 0, 190, 90, 20).setHoverText("Right click to set blocks to become lit lanterns. To visually indicate if on or not.").setOnPress(function (gui, t) {
        e.player.closeGui()
        e.player.tempdata.put("setting_powerline_interface", e.block)

    })

    GUI.addButton(82, "Clear Power Line", 150, 190, 90, 20).setHoverText("Clear all registered blocks").setOnPress(function (gui, t) {
        e.block.storeddata.put("powerline_pos_array", JSON.stringify([]))
        e.player.message("Power Line Cleared")
    })
    var defaultStateString = ["Off", "On"]
    GUI.addLabel(92, "Default State: " + defaultStateString[e.block.storeddata.get("defaultState")], 250, 120, 1, 1, 0xffffff)
    GUI.addButton(90, "On", 260, 130, 20, 20).setOnPress(function (gui, t) {
        e.block.storeddata.put("defaultState", 1)
        gui.getComponent(92).setText("Default State: On")
        gui.update()
        setOn()

    })
    GUI.addButton(91, "Off", 290, 130, 20, 20).setOnPress(function (gui, t) {
        e.block.storeddata.put("defaultState", 0)
        gui.getComponent(92).setText("Default State: Off")
        gui.update()
        setOff()
    })
    e.player.showCustomGui(GUI)

    e.block.storeddata.put("on", e.block.storeddata.get("defaultState"))
    function setOn() {

        e.block.setGeckoTexture("iob:textures/block/ancient_interface_on.png")
        e.block.setLight(10)
        e.block.storeddata.put("on", 1)
        setPowerLineState(true)
        e.block.executeCommand(e.block.storeddata.get("onCommand"))
    }
    function setOff() {

        e.block.setGeckoTexture("iob:textures/block/ancient_interface_off.png")
        e.block.setLight(5)
        setPowerLineState(false)
        e.block.storeddata.put("on", 0)
        e.block.executeCommand(e.block.storeddata.get("offCommand"))
    }
    if (e.block.storeddata.get("on")) {
        setOn()
    }
    else {
        setOff()
    }
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

var powerline_pos_array = []

function trigger(e) {
    if (e.id == 1) {
        var powerline_pos_array = JSON.parse(block.storeddata.get("powerline_pos_array"))
        powerline_pos_array.push({ x: e.arguments[0].x, y: e.arguments[0].y, z: e.arguments[0].z })
        block.storeddata.put("powerline_pos_array", JSON.stringify(powerline_pos_array))
    }
    if (e.id == 2) {

        var powerline_pos_array = JSON.parse(block.storeddata.get("powerline_pos_array"))
        if (powerline_pos_array.indexOf({ x: e.arguments[0].x, y: e.arguments[0].y, z: e.arguments[0].z }) != -1) powerline_pos_array.splice(powerline_pos_array.indexOf({ x: e.arguments[0].x, y: e.arguments[0].y, z: e.arguments[0].z }), 1)
        block.storeddata.put("powerline_pos_array", JSON.stringify(powerline_pos_array))
    }
}