var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/scoreboard.js')
var visible = {

}

var GUI

function init(e) {
    e.block.timers.forceStart(1, 0, true)
    setDefaultValues(e)
    e.block.setModel("barrier")
    e.block.setIsPassible(true)
}

function damaged(e) {
    e.setCanceled(true)
}

function setDefaultValues(e) {
    var values = {
        "Heart": 0,
        "Body": 0,
        "Mind": 0,
        "Range": 10,
        "message": "",
        "dialog": 0,
        "speaker": "",
        "disappear_on_use": 0,
        "sound": "",
        "sound_volume": 1,
        "sound_pitch": 1,
        "r": 1,
        "g": 1,
        "b": 1
    }
    for (var value in values) {
        if (!e.block.storeddata.has(value)) {
            e.block.storeddata.put(value, values[value])
        }
    }
}

function timer(e) {
    nearPlayer(e, e.block.storeddata.get("Range"))
}
function interact(e) {
    if (e.player.gamemode == 1 && e.player.isSneaking()) {
        createObservationGUI(e)
        return
    }
    if (!visible[e.player.name]) return
    if (e.block.storeddata.get("dialog") != 0) {
        e.player.showDialog(e.block.storeddata.get("dialog"), e.block.storeddata.get("speaker").replace("&", "§"))
    }
    else {
        e.player.message(e.block.storeddata.get("message"))
    }
    if (e.block.storeddata.get("disappear_on_use")) {
        var seen_observations = JSON.parse(e.player.storeddata.get("seen_observations"))
        seen_observations.push(get_unique_block_id(e))
        e.player.storeddata.put("seen_observations", JSON.stringify(seen_observations))
    }
    e.player.playSound("minecraft:ui.cartography_table.take_result", 1, 2)
    if (e.block.storeddata.get("sound") != "") {
        e.player.playSound(e.block.storeddata.get("sound"), e.block.storeddata.get("sound_volume"), e.block.storeddata.get("sound_pitch"))
    }
    if (e.player.tempdata.has("looking")) {

        e.block.executeCommand('/title ' + e.player.name + ' actionbar {"text":""}')
        e.player.tempdata.remove("looking")
    }
    if (e.block.tempdata.has("commands")) {
        for (var command in e.block.tempdata.get("commands")) {
            e.block.executeCommand(e.block.tempdata.get("commands")[command].replaceAll("@dp", e.player.name))
        }
    }
}

function createObservationGUI(e) {
    GUI = e.API.createCustomGui(1, 256, 256, false, e.player)
    GUI.addTextField(10, 20, 20, 25, 20).setCharacterType(1).setInteger(e.block.storeddata.get("Heart")).setOnChange(function (gui, t) {
        e.block.storeddata.put("Heart", t.getInteger())
    })
    GUI.addTextField(20, 20, 50, 25, 20).setCharacterType(1).setInteger(e.block.storeddata.get("Body")).setOnChange(function (gui, t) {
        e.block.storeddata.put("Body", t.getInteger())
    })

    GUI.addTextField(30, 20, 80, 25, 20).setCharacterType(1).setInteger(e.block.storeddata.get("Mind")).setOnChange(function (gui, t) {
        e.block.storeddata.put("Mind", t.getInteger())
    })

    GUI.addTextField(40, 90, 50, 25, 20).setCharacterType(1).setInteger(e.block.storeddata.get("Range")).setOnChange(function (gui, t) {
        e.block.storeddata.put("Range", t.getInteger())
    })

    GUI.addLabel(11, "Heart", -20, 25, 1, 1, 0xff0000)
    GUI.addLabel(21, "Body", -20, 55, 1, 1, 0x00ff00)
    GUI.addLabel(31, "Mind", -20, 85, 1, 1, 0x0000ff)
    GUI.addLabel(41, "Range", 90, 40, 1, 1, 0xffffff)
    GUI.addTextField(50, 20, 120, 300, 20).setText(e.block.storeddata.get("message")).setOnChange(function (gui, t) {
        e.block.storeddata.put("message", t.getText())
    })

    GUI.addLabel(61, "OR Dialog         Speaker", 20, 143, 1, 1, 0xffffff)
    GUI.addTextField(60, 20, 155, 50, 20).setCharacterType(1).setInteger(e.block.storeddata.get("dialog")).setOnChange(function (gui, t) {
        e.block.storeddata.put("dialog", t.getInteger())
    })

    GUI.addLabel(51, "Message", 20, 110, 1, 1, 0xffffff)

    GUI.addTextField(62, 100, 155, 100, 20).setText(e.block.storeddata.get("speaker")).setOnChange(function (gui, t) {
        e.block.storeddata.put("speaker", t.getText())
    })
    var tf_text = ["False", "True"]
    GUI.addButton(70, "False", 150, 42, 60, 20).setLabel(tf_text[e.block.storeddata.get("disappear_on_use")]).setOnPress(function (gui, t) {
        e.block.storeddata.put("disappear_on_use", Number(!Boolean(e.block.storeddata.get("disappear_on_use"))))
        t.setLabel(tf_text[e.block.storeddata.get("disappear_on_use")])
        gui.update()
    })
    GUI.addLabel(71, "Disappear On Use", 151, 30, 1, 1, 0xffffff)
    GUI.addTextField(80, 20, 200, 250, 20).setText(e.block.storeddata.get("sound")).setOnChange(
        function (gui, t) {
            e.block.storeddata.put("sound", t.getText())
        }
    )

    GUI.addLabel(81, "Sound", 20, 190, 1, 1, 0xffffff)
    GUI.addTextField(82, 20, 225, 30, 20).setText(e.block.storeddata.get("sound_volume")).setOnChange(
        function (gui, t) {
            e.block.storeddata.put("sound_volume", t.getText)
        }
    )
    GUI.addTextField(83, 70, 225, 30, 20).setText(e.block.storeddata.get("sound_pitch")).setOnChange(
        function (gui, t) {
            e.block.storeddata.put("sound_pitch", t.getText())
        }
    )
    GUI.addLabel(84, "V", 10, 230, 1, 1, 0xffffff)
    GUI.addLabel(85, "P", 60, 230, 1, 1, 0xffffff)

    GUI.addLabel(95, "R        G         B", 200, 70, 1, 1, 0xffffff)
    GUI.addTextField(90, 200, 80, 25, 20).setText(e.block.storeddata.get("r")).setOnChange(
        function (gui, t) {
            e.block.storeddata.put("r", t.getText())
        }
    )
    GUI.addTextField(91, 240, 80, 25, 20).setText(e.block.storeddata.get("g")).setOnChange(
        function (gui, t) {
            e.block.storeddata.put("g", t.getText())
        }
    )
    GUI.addTextField(92, 280, 80, 25, 20).setText(e.block.storeddata.get("b")).setOnChange(
        function (gui, t) {
            e.block.storeddata.put("b", t.getText())
        }
    )
    e.player.showCustomGui(GUI)
}



function nearPlayer(e, range) {


    var world = e.block.world
    var players = world.getAllPlayers();
    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        if (p.pos.distanceTo(e.block.pos) < range && ((p.gamemode == 1) ||
            (!e.block.storeddata.get("disappear_on_use") || JSON.parse(p.storeddata.get("seen_observations")).indexOf(get_unique_block_id(e)) == -1)
            && (
                getScore("Heart", p.name) >= e.block.storeddata.get("Heart") &&
                getScore("Body", p.name) >= e.block.storeddata.get("Body") &&
                getScore("Mind", p.name) >= e.block.storeddata.get("Mind")
                &&
                (
                    e.block.storeddata.get("dialog") == 0 || api.getDialogs().get(e.block.storeddata.get("dialog")).getAvailability().isAvailable(p))
            )
        )) {
            var r = e.block.storeddata.get("r")
            var g = e.block.storeddata.get("g")
            var b = e.block.storeddata.get("b")
            e.block.executeCommand("/particle dust " + r + " " + g + " " + b + " .7 ~ ~-.4 ~ 0 0 0 0 0 force @e[distance=.." + (range + 2) + ",name='" + p.name + "',type=minecraft:player]")
            e.block.executeCommand("/particle dust " + r + " " + g + " " + b + " .7 ~ ~ ~ 0 0 0 0 0 force @e[distance=.." + (range + 2) + ",name='" + p.name + "',type=minecraft:player]")
            e.block.executeCommand("/particle dust " + r + " " + g + " " + b + " .7 ~ ~.15 ~ 0 0 0 0 0 force @e[distance=.." + (range + 2) + ",name='" + p.name + "',type=minecraft:player]")
            e.block.executeCommand("/particle dust " + r + " " + g + " " + b + " .7 ~ ~.30 ~ 0 0 0 0 0 force @e[distance=.." + (range + 2) + ",name='" + p.name + "',type=minecraft:player]")
            e.block.executeCommand("/particle dust " + r + " " + g + " " + b + " .7 ~ ~.45 ~ 0 0 0 0 0 force @e[distance=.." + (range + 2) + ",name='" + p.name + "',type=minecraft:player]")
            visible[p.name] = true
            var block = p.rayTraceBlock(3, false, false)
            if (block && block.pos.distanceTo(e.block.pos) == 0) {
                e.block.executeCommand('/title ' + p.name + ' actionbar {"text":"<Interact>","color":"#' + getHexFromRGB(r * 255, g * 255, b * 255).toString(16) + '"}')
                p.tempdata.put("looking", true)
            }
            if (p.tempdata.has("looking") && (!block || block.pos.distanceTo(e.block.pos) != 0)) {

                e.block.executeCommand('/title ' + p.name + ' actionbar {"text":"","color":"#' + getHexFromRGB(r * 255, g * 255, b * 255).toString(16) + '"}')
                p.tempdata.remove("looking")
            }
        }
        else {
            visible[p.name] = false
        }

    }
}

function get_unique_block_id(e) {
    return "x" + e.block.x + "y" + e.block.y + "z" + e.block.z
}

function getHexFromRGB(r, g, b) {
    return (r << 16) + (g << 8) + b
}