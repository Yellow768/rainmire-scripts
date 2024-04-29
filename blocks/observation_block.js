var radius, attribute, target, storeddata_string, command, GUI, block, storeddata_array


function init(e) {
    e.block.setIsPassible(true)
    block = e.block

    if (!e.block.storeddata.has("uuid")) {
        e.block.storeddata.put("uuid", e.API.clones.get(1, "Fish", e.block.world).generateNewUUID())
    }
    if (!e.block.storeddata.has("radius")) {
        e.block.storeddata.put("radius", 0)
        e.block.storeddata.put("attribute", "Charm")
        e.block.storeddata.put("target", 0)
        e.block.storeddata.put("storeddata", "[]")
        e.block.storeddata.put("command", "")
    }
    radius = e.block.storeddata.get("radius")
    attribute = e.block.storeddata.get("attribute")
    target = e.block.storeddata.get("target")
    storeddata_string = e.block.storeddata.get("storeddata")
    command = e.block.storeddata.get("command")
    storeddata_array = JSON.parse('[' + storeddata_string + ' ]')
}

function interact(e) {
    GUI = e.API.createCustomGui(1, 256, 256, false, e.player)
    GUI.addTextField(1, 100, 0, 50, 20).setCharacterType(1).setText(radius)
    GUI.addTextField(2, 100, 40, 150, 20).setText(attribute)
    GUI.addTextField(3, 100, 80, 50, 20).setCharacterType(1).setText(target)
    GUI.addTextField(4, 100, 120, 150, 20).setText(storeddata_string)
    GUI.addTextField(5, 100, 160, 300, 20).setText(command)
    GUI.addLabel(6, "Radius", 0, 0, 155, 20, 0xffffff)
    GUI.addLabel(7, "Attribute", 0, 45, 150, 20, 0xffffff)
    GUI.addLabel(8, "Target", 0, 80, 155, 20, 0xffffff)
    GUI.addLabel(9, "Storeddata", 0, 125, 150, 20, 0xffffff)
    GUI.addLabel(10, "Command", 0, 165, 150, 20, 0xffffff)
    GUI.addButton(11, "Save", 0, 200, 150, 20)
    GUI.addButton(12, "New UUID", 220, -5, 60, 20)
    e.player.showCustomGui(GUI)

}

function tick(e) {
    if (e.block.world.storeddata.get("observationBlocksVisible") == 1) {
        e.block.setModel("supplementaries:end_stone_lamp")
        e.block.setLight(10)
    }
    else {
        e.block.setModel("minecraft:barrier")
        e.block.setLight(0)
    }
    var scoreboard = e.block.world.scoreboard
    var nE = e.block.world.getNearbyEntities(e.block.pos, radius, 1)
    for (var i = 0; i < nE.length; i++) {
        var validPlayer = true
        if (!nE[i].storeddata.has("foundObservationBlocks")) nE[i].storeddata.put("foundObservationBlocks", "[]")
        var allFoundBlocks = JSON.parse(nE[i].storeddata.get("foundObservationBlocks"))

        if (allFoundBlocks.indexOf(e.block.storeddata.get("uuid")) != -1) {
            validPlayer = false

        }
        for (var j = 0; j < storeddata_array.length; j++) {
            if (!nE[i].storeddata.has(storeddata_array[j]) && storeddata_string[j] != "") {
                validPlayer = false
            }
        }
        if (!scoreboard.hasPlayerObjective(nE[i].name, attribute) || scoreboard.getPlayerScore(nE[i].name, attribute) < target) {
            validPlayer = false


        }

        if (validPlayer) {
            e.block.executeCommand(command.replace(/player/g, nE[i].name))
            //nE[i].message(command.replace(/player/g, nE[i].name))
            allFoundBlocks.push(e.block.storeddata.get("uuid"))
            nE[i].storeddata.put("foundObservationBlocks", JSON.stringify(allFoundBlocks))
        }
        //
    }


}


function customGuiButton(e) {
    if (e.buttonId == 12) {
        block.storeddata.put("uuid", e.API.clones.get(1, "Fish", block.world).generateNewUUID())
        return
    }
    block.storeddata.put("radius", GUI.getComponent(1).getInteger())
    block.storeddata.put("attribute", GUI.getComponent(2).getText())
    block.storeddata.put("target", GUI.getComponent(3).getInteger())
    block.storeddata.put("storeddata", GUI.getComponent(4).getText())
    block.storeddata.put("command", GUI.getComponent(5).getText())
    radius = block.storeddata.get("radius")
    attribute = block.storeddata.get("attribute")
    target = block.storeddata.get("target")
    storeddata_string = block.storeddata.get("storeddata")
    command = block.storeddata.get("command")
    storeddata_array = JSON.parse('["' + storeddata_string + ' "]')
    GUI.close()
}