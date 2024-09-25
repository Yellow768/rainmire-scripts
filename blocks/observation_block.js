var radius, attribute, current_target, tags, command, GUI, npc


function init(e) {
    npc = e.npc
    if (!e.npc.storeddata.has("radius")) {
        e.npc.storeddata.put("radius", 0)
        e.npc.storeddata.put("attribute", "Charm")
        e.npc.storeddata.put("target", 0)
        e.npc.storeddata.put("command", "")
    }
    radius = e.npc.storeddata.get("radius")
    attribute = e.npc.storeddata.get("attribute")
    current_target = e.npc.storeddata.get("target")
    tags = e.npc.getTags()
    command = e.npc.storeddata.get("command")
}

function interact(e) {
    GUI = e.API.createCustomGui(1, 256, 256, false, e.player)
    GUI.addTextField(1, 100, 0, 50, 20).setCharacterType(1).setText(radius)
    GUI.addTextField(2, 100, 40, 150, 20).setText(attribute)
    GUI.addTextField(3, 100, 80, 50, 20).setCharacterType(1).setText(current_target)
    GUI.addTextField(5, 100, 160, 300, 20).setText(command)
    GUI.addLabel(6, "Radius", 0, 0, 155, 20, 0xffffff)
    GUI.addLabel(7, "Attribute", 0, 45, 150, 20, 0xffffff)
    GUI.addLabel(8, "Target", 0, 80, 155, 20, 0xffffff)
    GUI.addLabel(9, "Tags", 0, 125, 150, 20, 0xffffff)
    GUI.addLabel(10, "Command", 0, 165, 150, 20, 0xffffff)
    GUI.addButton(11, "Save", 0, 200, 150, 20)
    GUI.addButton(12, "New UUID", 220, -5, 60, 20)
    e.player.showCustomGui(GUI)

}

function tick(e) {
    var scoreboard = e.npc.world.scoreboard
    var nE = e.npc.world.getNearbyEntities(e.npc.pos, radius, 1)
    for (var i = 0; i < nE.length; i++) {

        var validPlayer = true
        if (!nE[i].storeddata.has("foundObservationNPCS")) nE[i].storeddata.put("foundObservationNPCS", "{[]}")
        var allFoundnpcs = JSON.parse(nE[i].storeddata.get("foundObservationNPCS"))

        if (allFoundnpcs.indexOf(e.npc.getUUID()) != -1) {
            validPlayer = false
        }
        for (var j = 0; j < e.npc.getTags().length; j++) {
            if (!nE[i].hasTag(e.npc.getTags()[i])) {
                validPlayer = false
            }
        }
        if (!scoreboard.hasPlayerObjective(nE[i].name, attribute) || scoreboard.getPlayerScore(nE[i].name, attribute) < current_target) {
            validPlayer = false
        }
        if (validPlayer) {
            e.npc.executeCommand(command.replace(/player/g, nE[i].name))
            //nE[i].message(command.replace(/player/g, nE[i].name))
            allFoundnpcs.push(e.npc.getUUID())
            nE[i].storeddata.put("foundObservationNPCS", JSON.stringify(allFoundnpcs))
        }
        //
    }


}


function customGuiButton(e) {
    npc.storeddata.put("radius", GUI.getComponent(1).getInteger())
    npc.storeddata.put("attribute", GUI.getComponent(2).getText())
    npc.storeddata.put("target", GUI.getComponent(3).getInteger())
    npc.storeddata.put("command", GUI.getComponent(5).getText())
    radius = npc.storeddata.get("radius")
    attribute = npc.storeddata.get("attribute")
    current_target = npc.storeddata.get("target")
    command = npc.storeddata.get("command")
    GUI.close()
}