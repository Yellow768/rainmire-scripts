var REMNANT_GUI
var L_TitleID = 10
var L_CoordinateID = 20
var TA_CoordXID = 30
var TA_CoordYID = 31
var TA_CoordZID = 32
var B_UseCurrentCoordID = 35
var B_SaveID = 40
var tX, tY, tZ
var nX, nY, nZ
var npc

function init(e) {
    if (e.npc.storeddata.get("x") == undefined) { e.npc.storeddata.put("x", e.npc.x) }
    if (e.npc.storeddata.get("y") == undefined) { e.npc.storeddata.put("y", e.npc.y) }
    if (e.npc.storeddata.get("z") == undefined) { e.npc.storeddata.put("z", e.npc.z) }
    npc = e.npc
    nX = e.npc.storeddata.get("x")
    nY = e.npc.storeddata.get("y")
    nZ = e.npc.storeddata.get("z")
    perk_init(e)

}



function damaged(e) {
    e.setCanceled(true)
}

function setSpawnPoint(player) {
    player.storeddata.put("spawnX", nX)
    player.storeddata.put("spawnY", nY)
    player.storeddata.put("spawnZ", nZ)

    npc.executeCommand("/spawnpoint " + player.name + " -90 84 -113")
    npc.executeCommand("playsound minecraft:entity.evoker.prepare_summon player " + player.name + " ~ ~ ~ 1")
    npc.executeCommand("/particle minecraft:dust 0 1 0 2 ~ ~.5 ~ 1 .5 1 1 150")
    npc.executeCommand('/title ' + player.name + ' times 0 40 20')
    npc.executeCommand('/title ' + player.name + ' subtitle {"text":"Soul locked on to remnant","italic":true,"color":"green"}')
    npc.executeCommand('/title ' + player.name + ' title {"text":"RESPAWN POINT SET","bold":true,"color":"green"}')


}

function showCustomGui(e) {



    REMNANT_GUI = e.API.createCustomGui(1, 256, 256, false)
    REMNANT_GUI.addLabel(L_TitleID, "Remnant of Safety Settings", 70, 0, 1, 1)
    REMNANT_GUI.addLabel(L_CoordinateID, "Respawn Coordinates:", -40, 50, 1, 1)
    REMNANT_GUI.addTextField(TA_CoordXID, 80, 45, 60, 10)
    REMNANT_GUI.addTextField(TA_CoordYID, 150, 45, 60, 10)
    REMNANT_GUI.addTextField(TA_CoordZID, 220, 45, 60, 10)

    tX = REMNANT_GUI.getComponent(TA_CoordXID)
    tY = REMNANT_GUI.getComponent(TA_CoordYID)
    tZ = REMNANT_GUI.getComponent(TA_CoordZID)

    tX.setText(nX)
    tY.setText(nY)
    tZ.setText(nZ)

    REMNANT_GUI.addButton(B_UseCurrentCoordID, "Use Current Position", 78, 65, 125, 20)
    REMNANT_GUI.addButton(B_SaveID, "Save and Exit", 78, 150, 80, 20)
    e.player.showCustomGui(REMNANT_GUI)
}

function customGuiButton(e) {
    if (e.player.getCustomGui() != REMNANT_GUI) {
        perk_customGuiButton(e)
        return
    }
    if (e.buttonId == B_UseCurrentCoordID) {
        REMNANT_GUI.getComponent(TA_CoordXID).setText(Math.floor(e.player.x))
        REMNANT_GUI.getComponent(TA_CoordYID).setText(Math.floor(e.player.y))
        REMNANT_GUI.getComponent(TA_CoordZID).setText(Math.floor(e.player.z))
        REMNANT_GUI.update(e.player)
    }
    if (e.buttonId == B_SaveID) {
        if (!isNaN(tX.getText()) && !isNaN(tY.getText()) && !isNaN(tZ.getText())) {
            nX = tX.getText()
            nY = tY.getText()
            nZ = tZ.getText()
            npc.storeddata.put("x", nX)
            npc.storeddata.put("y", nY)
            npc.storeddata.put("z", nZ)
            e.player.closeGui()
            e.player.message("Remnant Spawn Point Set")
            e.player.storeddata.put("remnantUUID", "")
        }
        else {
            REMNANT_GUI.addLabel(50, "Coordinates must be numerical values only!", 80, 180, 1, 1)
            REMNANT_GUI.update(e.player)

        }
    }
}

function trigger(e) {
    if (e.id == 1) {
        var player = e.arguments[0]
        player.addPotionEffect(10, 3, 100, false)
        if (player.storeddata.get("remnantUUID") != npc.getUUID()) {
            setSpawnPoint(player)
            player.storeddata.put("remnantUUID", npc.getUUID())
        }
        else {
            npc.executeCommand('/title ' + player.name + ' actionbar {"text":"No longer locked to this remnant","bold":true,"color":"green"}')
            player.playSound("minecraft:entity.guardian.hurt", 1, 1)
            player.storeddata.remove("spawnX")
            player.storeddata.remove("spawnY")
            player.storeddata.remove("spawnZ")
            player.storeddata.remove("remnantUUID")
        }
        // e.npc.executeCommand("noppes quest objective " + e.player.name + " 5 0 1")
    }
    if (e.id == 2) {
        showCustomGui(e.arguments[0])
    }
}