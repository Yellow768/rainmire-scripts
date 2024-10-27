var api = Java.type('noppes.npcs.api.NpcAPI').Instance();
load(api.getLevelDir() + '/scripts/ecmascript/boiler/scoreboard.js')

var visible = {

}



var EntityPlayerMP = Java.type("net.minecraft.server.level.ServerPlayer")
var PacketPlayOutEntityDestroy = Java.type("net.minecraft.network.protocol.game.ClientboundRemoveEntitiesPacket")
var PacketPlayOutSpawnEntityLiving = Java.type("net.minecraft.network.protocol.game.ClientboundAddEntityPacket")
var iEntity = Java.type("net.minecraft.world.entity.Entity")

var GUI

function init(e) {
    e.npc.timers.forceStart(1, 0, true)
    setDefaultValues(e)
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
        "message": " ",
        "dialog": -1,
        "speaker": " ",
        "disappear_on_use": 0,
        "sound": "",
        "sound_volume": 1,
        "sound_pitch": 1
    }
    for (var value in values) {
        if (!e.npc.storeddata.has(value)) {
            e.npc.storeddata.put(value, values[value])
        }
    }
}

function timer(e) {
    nearPlayer(e.npc, e.npc.storeddata.get("Range"))
}
function interact(e) {
    if (e.player.gamemode == 1 && e.player.isSneaking()) {
        createObservationGUI(e)
        return
    }
    if (e.npc.storeddata.get("dialog") != -1) {
        e.player.showDialog(e.npc.storeddata.get("dialog"), e.npc.storeddata.get("speaker").replace("&", "§"))
    }
    else {
        e.player.message(e.npc.storeddata.get("message"))
    }
    if (e.npc.storeddata.get("disappear_on_use")) {
        var seen_observations = JSON.parse(e.player.storeddata.get("seen_observations"))
        seen_observations.push(e.npc.getUUID())
        e.player.storeddata.put("seen_observations", JSON.stringify(seen_observations))
    }
    e.player.playSound("minecraft:ui.cartography_table.take_result", 1, 2)
    if (e.npc.storeddata.get("sound") != "") {
        e.player.playSound(e.npc.storeddata.get("sound"), e.npc.storeddata.get("sound_volume"), e.npc.storeddata.get("sound_pitch"))
    }
}

function createObservationGUI(e) {
    GUI = e.API.createCustomGui(1, 256, 256, false, e.player)
    GUI.addTextField(10, 20, 20, 25, 20).setCharacterType(1).setInteger(e.npc.storeddata.get("Heart")).setOnChange(function (gui, t) {
        e.npc.storeddata.put("Heart", t.getInteger())
    })
    GUI.addTextField(20, 20, 50, 25, 20).setCharacterType(1).setInteger(e.npc.storeddata.get("Body")).setOnChange(function (gui, t) {
        e.npc.storeddata.put("Body", t.getInteger())
    })

    GUI.addTextField(30, 20, 80, 25, 20).setCharacterType(1).setInteger(e.npc.storeddata.get("Mind")).setOnChange(function (gui, t) {
        e.npc.storeddata.put("Mind", t.getInteger())
    })

    GUI.addTextField(40, 90, 50, 25, 20).setCharacterType(1).setInteger(e.npc.storeddata.get("Range")).setOnChange(function (gui, t) {
        e.npc.storeddata.put("Range", t.getInteger())
    })

    GUI.addLabel(11, "Heart", -20, 25, 1, 1, 0xff0000)
    GUI.addLabel(21, "Body", -20, 55, 1, 1, 0x00ff00)
    GUI.addLabel(31, "Mind", -20, 85, 1, 1, 0x0000ff)
    GUI.addLabel(41, "Range", 90, 40, 1, 1, 0xffffff)
    GUI.addTextField(50, 20, 120, 300, 20).setText(e.npc.storeddata.get("message")).setOnChange(function (gui, t) {
        e.npc.storeddata.put("message", t.getText())
    })

    GUI.addLabel(61, "OR Dialog         Speaker", 20, 143, 1, 1, 0xffffff)
    GUI.addTextField(60, 20, 155, 50, 20).setCharacterType(1).setInteger(e.npc.storeddata.get("dialog")).setOnChange(function (gui, t) {
        e.npc.storeddata.put("dialog", t.getInteger())
    })

    GUI.addLabel(51, "Message", 20, 110, 1, 1, 0xffffff)

    GUI.addTextField(62, 100, 155, 100, 20).setText(e.npc.storeddata.get("speaker")).setOnChange(function (gui, t) {
        e.npc.storeddata.put("speaker", t.getText())
    })
    var tf_text = ["False", "True"]
    GUI.addButton(70, "False", 150, 42, 60, 20).setLabel(tf_text[e.npc.storeddata.get("disappear_on_use")]).setOnPress(function (gui, t) {
        e.npc.storeddata.put("disappear_on_use", Number(!Boolean(e.npc.storeddata.get("disappear_on_use"))))
        t.setLabel(tf_text[e.npc.storeddata.get("disappear_on_use")])
        gui.update()
    })
    GUI.addLabel(71, "Disappear On Use", 151, 30, 1, 1, 0xffffff)
    GUI.addTextField(80, 20, 200, 250, 20).setText(e.npc.storeddata.get("sound")).setOnChange(
        function (gui, t) {
            e.npc.storeddata.put("sound", t.getText())
        }
    )

    GUI.addLabel(81, "Sound", 20, 190, 1, 1, 0xffffff)
    GUI.addTextField(82, 20, 225, 30, 20).setText(e.npc.storeddata.get("sound_volume")).setOnChange(
        function (gui, t) {
            e.npc.storeddata.put("sound_volume", t.getText)
        }
    )
    GUI.addTextField(83, 70, 225, 30, 20).setText(e.npc.storeddata.get("sound_pitch")).setOnChange(
        function (gui, t) {
            e.npc.storeddata.put("sound_pitch", t.getText())
        }
    )
    GUI.addLabel(84, "V", 10, 230, 1, 1, 0xffffff)
    GUI.addLabel(85, "P", 60, 230, 1, 1, 0xffffff)
    e.npc.storeddata.remove(e.player.name)
    e.player.showCustomGui(GUI)
}


function nearPlayer(npc, range) {

    var world = npc.getWorld();

    var npcEntity = npc.getMCEntity();

    var players = world.getAllPlayers();
    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        var playerId = p.getMCEntity().m_19880_(); // Get player entity ID
        if ((p.gamemode != 1) && (npc.getPos().distanceTo(p.getPos()) >= range ||
            getScore("Heart", p.name) < npc.storeddata.get("Heart") ||
            getScore("Body", p.name) < npc.storeddata.get("Body") ||
            getScore("Mind", p.name) < npc.storeddata.get("Mind") ||
            (npc.storeddata.get("dialog") != -1 && !api.getDialogs().get(npc.storeddata.get("dialog")).getAvailability().isAvailable(p)) ||
            (npc.storeddata.get("disappear_on_use") && JSON.parse(p.storeddata.get("seen_observations")).indexOf(npc.getUUID()) != -1))) {
            var packetDestroy = new PacketPlayOutEntityDestroy([npcEntity.m_19879_()]);
            p.getMCEntity().f_8906_.m_9829_(packetDestroy);
            visible[playerId] = false;
        } else {
            if (!visible[playerId] && (p.gamemode == 1 ||
                (
                    getScore("Heart", p.name) >= npc.storeddata.get("Heart") &&
                    getScore("Body", p.name) >= npc.storeddata.get("Body") &&
                    getScore("Mind", p.name) >= npc.storeddata.get("Mind"))
                &&
                (
                    npc.storeddata.get("dialog") == -1 || api.getDialogs().get(npc.storeddata.get("dialog")).getAvailability().isAvailable(p)))
            ) {
                var packetSpawn = new PacketPlayOutSpawnEntityLiving(npcEntity);
                p.getMCEntity().f_8906_.m_9829_(packetSpawn);
                npc.updateClient()
                visible[playerId] = true;
            }
        }
    }
}