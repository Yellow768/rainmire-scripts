var GUI_CompanionQuipNPC
var block
var infoTextString
var _GUI_IDS = {
    counter: 1,
    ids: {},
    lookup: {}
}; // var tempdata = API.getIWorld(0).getTempdata();
// if(tempdata.get('_GUI_IDS')) {
//     _GUI_IDS = tempdata.get('_GUI_IDS');
// } else {
//     tempdata.put('_GUI_IDS', _GUI_IDS);
// }

function id(name) {
    if (!name) {
        name = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);
    }

    var _id = _GUI_IDS.ids[name] || (_GUI_IDS.ids[name] = _GUI_IDS.counter++);

    _GUI_IDS.lookup[_id] = name;
    return _id;
}

function idname(_id) {
    return _GUI_IDS.lookup[_id];
}

function removeid(name) {
    var _id = id(name);

    delete _GUI_IDS.lookup[_id];
    delete _GUI_IDS.ids[name];
}

;

function init(e) {
    block = e.block
    e.block.setModel("supplementaries:speaker_block")
    e.block.setScale(1, .8, 1)
    e.block.timers.forceStart(1, 80, true)
    if (e.block.storeddata.get("range") == null) {
        e.block.storeddata.put("quipName", "Unnamed Quip")
        e.block.storeddata.put("range", 5)
    }

    updateBlockText()
    e.block.getTextPlane().setOffsetY(.1)
    e.block.getTextPlane2().setOffsetY(.1)
    e.block.getTextPlane3().setOffsetY(.1)
    e.block.getTextPlane4().setOffsetY(.1)
    e.block.getTextPlane2().setRotationY(90)
    e.block.getTextPlane3().setRotationY(180)
    e.block.getTextPlane4().setRotationY(270)
    //e.block.getTextPlane3().setText("&eRange: " + e.block.storeddata.get("range") + " blocks")
    // e.block.getTextPlane4().setText("&cRight Click To Edit")
    // e.block.getTextPlane().setOffsetY(.2)
    //e.block.getTextPlane2().setOffsetY(.1)
    //e.block.getTextPlane4().setOffsetY(-0.2)



}

function updateBlockText(e) {
    infoTextString = "&aCompanion Quip Block\n\n&eName: " + block.storeddata.get("quipName") + "\n&eRange: " + block.storeddata.get("range") + " blocks\n\n&cRight Click To Edit"
    block.getTextPlane().setText(infoTextString)
    block.getTextPlane2().setText(infoTextString)
    block.getTextPlane3().setText(infoTextString)
    block.getTextPlane4().setText(infoTextString)
}

function timer(e) {
    if (e.id == 1) {
        var nE = e.block.world.getNearbyEntities(e.block.pos, e.block.storeddata.get("range"), 2)
        if (nE.length > 0) {
            for (var i = 0; i < nE.length; i++) {
                nE[i].trigger(5005, [e, nE[i], e.block.storeddata.get("quipName")])
            }
        }
    }
}

function trigger(e) {
    if (e.id == 1) {
        e.arguments[0].block.executeCommand("say " + e.arguments[1])
    }
}

function interact(e) {
    if (e.player.gamemode == 1) {
        GUI_CompanionQuipNPC = e.API.createCustomGui(id("GUI_CompanionQuip"), 256, 256, false)
        GUI_CompanionQuipNPC.addLabel(id("cqtitle"), "Companion Quip Block", 64, 0, 1, 1)
        GUI_CompanionQuipNPC.addLabel(id("quipName"), "Quip Name", 0, 100, 1, 1)
        GUI_CompanionQuipNPC.addLabel(id("range"), "Range", 0, 140, 1, 1)

        GUI_CompanionQuipNPC.addTextField(id("quipText"), 60, 97, 160, 15)
        GUI_CompanionQuipNPC.addTextField(id("rangeText"), 60, 137, 160, 15)

        GUI_CompanionQuipNPC.addButton(id("saveButton"), "Save Changes", 60, 180, 80, 20)
        GUI_CompanionQuipNPC.getComponent(id("quipName")).setHoverText("Use the same name in the companion NPC")

        if (e.block.storeddata.get("quipName") != null) {
            GUI_CompanionQuipNPC.getComponent(id("quipText")).setText(e.block.storeddata.get("quipName"))
            GUI_CompanionQuipNPC.getComponent(id("rangeText")).setText(e.block.storeddata.get("range"))
        }

        e.player.message((e.block.storeddata.get("quipName")))
        e.player.showCustomGui(GUI_CompanionQuipNPC)
    }
}


function customGuiButton(e) {
    if (e.buttonId == id("saveButton")) {
        block.storeddata.put("quipName", GUI_CompanionQuipNPC.getComponent(id("quipText")).getText())
        block.storeddata.put("range", GUI_CompanionQuipNPC.getComponent(id("rangeText")).getText())
        e.player.closeGui()

        updateBlockText()
    }
}