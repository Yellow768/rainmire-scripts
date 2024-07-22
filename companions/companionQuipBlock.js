var GUI_CompanionQuipNPC
var block
var infoTextString

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
        var nE = e.block.level.getNearbyEntities(e.block.pos, e.block.storeddata.get("range"), 2)
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

    GUI_CompanionQuipNPC = e.API.createCustomGui(9, 256, 256, false, e.player)
    // GUI_CompanionQuipNPC.addLabel(10, "Companion Quip Block", 64, 0, 1, 1)
    //GUI_CompanionQuipNPC.addLabel(11, "Quip Name", 0, 100, 1, 1)
    // GUI_CompanionQuipNPC.addLabel(12, "Range", 0, 140, 1, 1)

    // GUI_CompanionQuipNPC.addTextField(13, 60, 97, 160, 15)
    //GUI_CompanionQuipNPC.addTextField(14, 60, 137, 160, 15)

    // GUI_CompanionQuipNPC.addButton(15, "Save Changes", 60, 180, 80, 20)
    // GUI_CompanionQuipNPC.getComponent(11).setHoverText("Use the same name in the companion NPC")

    // if (e.block.storeddata.get("quipName") != null) {
    // GUI_CompanionQuipNPC.getComponent(11).setText(e.block.storeddata.get("quipName"))
    // GUI_CompanionQuipNPC.getComponent(12).setText(e.block.storeddata.get("range"))
    // }

    //e.player.message((e.block.storeddata.get("quipName")))
    e.player.showCustomGui(GUI_CompanionQuipNPC)

}


function customGuiButton(e) {
    if (e.buttonId == 15) {
        block.storeddata.put("quipName", GUI_CompanionQuipNPC.getComponent(13).getText())
        block.storeddata.put("range", GUI_CompanionQuipNPC.getComponent(14).getText())
        e.player.closeGui()

        updateBlockText()
    }
}