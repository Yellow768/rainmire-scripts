var respawnPointEditorGUI
var L_TitleID = 10
var L_CoordinateID = 20
var TA_CoordXID = 30
var TA_CoordYID = 31
var TA_CoordZID = 32
var B_UseCurrentCoordID = 35
var B_SaveID = 40
var tX, tY, tZ
var nX, nY, nZ



function initializeRespawnPointData(e) {
    if (e.npc.storeddata.get("x") == undefined) { e.npc.storeddata.put("x", e.npc.x) }
    if (e.npc.storeddata.get("y") == undefined) { e.npc.storeddata.put("y", e.npc.y) }
    if (e.npc.storeddata.get("z") == undefined) { e.npc.storeddata.put("z", e.npc.z) }
    npc = e.npc
    nX = e.npc.storeddata.get("x")
    nY = e.npc.storeddata.get("y")
    nZ = e.npc.storeddata.get("z")
}

function respawnPointEditorGuiButton(e) {
    if (e.buttonId == B_UseCurrentCoordID) {
        respawnPointEditorGUI.getComponent(TA_CoordXID).setText(Math.floor(e.player.x))
        respawnPointEditorGUI.getComponent(TA_CoordYID).setText(Math.floor(e.player.y))
        respawnPointEditorGUI.getComponent(TA_CoordZID).setText(Math.floor(e.player.z))
        respawnPointEditorGUI.update()
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
            e.player.storeddata.remove("remnantUUID")
        }
        else {
            respawnPointEditorGUI.addLabel(50, "Coordinates must be numerical values only!", 80, 180, 1, 1)
            respawnPointEditorGUI.update()

        }
    }
}


function openRespawnPointEditorGUI() {

    respawnPointEditorGUI = API.createCustomGui(3, 256, 256, false, player)
    respawnPointEditorGUI.addLabel(L_TitleID, "Remnant Respawn Settings", 70, 0, 1, 1, 0xffffff)
    respawnPointEditorGUI.addLabel(L_CoordinateID, "Respawn Coordinates:", -40, 50, 1, 1, 0xffffff)
    respawnPointEditorGUI.addTextField(TA_CoordXID, 80, 45, 60, 10)
    respawnPointEditorGUI.addTextField(TA_CoordYID, 150, 45, 60, 10)
    respawnPointEditorGUI.addTextField(TA_CoordZID, 220, 45, 60, 10)

    tX = respawnPointEditorGUI.getComponent(TA_CoordXID)
    tY = respawnPointEditorGUI.getComponent(TA_CoordYID)
    tZ = respawnPointEditorGUI.getComponent(TA_CoordZID)

    tX.setText(nX)
    tY.setText(nY)
    tZ.setText(nZ)

    respawnPointEditorGUI.addButton(B_UseCurrentCoordID, "Use Current Position", 78, 65, 125, 20)
    respawnPointEditorGUI.addButton(B_SaveID, "Save and Exit", 78, 150, 80, 20)
    respawnPointEditorGUI.addButton(180, "Perk Editor", 160, 20, 100, 20)
    player.showCustomGui(respawnPointEditorGUI)
}

function toggleRespawnAnchor(e) {
    e.player.addPotionEffect(10, 3, 100, false)
    switch (player.storeddata.get("remnantUUID")) {
        case npc.getUUID():
            removeSpawnPoint()
            break;
        default:
            setSpawnPoint()
            break;
    }

}

function setSpawnPoint() {
    player.storeddata.put("spawnX", nX)
    player.storeddata.put("spawnY", nY)
    player.storeddata.put("spawnZ", nZ)
    player.storeddata.put("remnantUUID", npc.getUUID())
    npc.executeCommand("/spawnpoint " + player.name + " -90 84 -113")
    npc.executeCommand("playsound minecraft:entity.evoker.prepare_summon player " + player.name + " ~ ~ ~ 1")
    npc.executeCommand("/particle minecraft:dust 0 1 0 2 ~ ~.5 ~ 1 .5 1 1 150 force")
    npc.executeCommand('/title ' + player.name + ' times 0 40 20')
    npc.executeCommand('/title ' + player.name + ' subtitle {"text":"Soul locked on to remnant","italic":true,"color":"green"}')
    npc.executeCommand('/title ' + player.name + ' title {"text":"RESPAWN POINT SET","bold":true,"color":"green"}')


}

function removeSpawnPoint() {
    npc.executeCommand('/title ' + player.name + ' actionbar {"text":"No longer locked to this remnant","bold":true,"color":"green"}')
    player.playSound("minecraft:entity.guardian.hurt", 1, 1)
    player.storeddata.remove("spawnX")
    player.storeddata.remove("spawnY")
    player.storeddata.remove("spawnZ")
    player.storeddata.remove("remnantUUID")
    addRemnantToRespawnArray(player)

}

function addRemnantToRespawnArray(player) {
    var respawnArray = []
    var respawn_pos = {
        x: parseInt(nX),
        y: parseInt(nY),
        z: parseInt(nZ)
    }
    if (player.storeddata.has("remnantUUID")) { return }
    if (!player.storeddata.has("respawnArray")) {
        player.storeddata.put("respawnArray", "[]")
    }
    respawnArray = player.storeddata.get("respawnArray")
    if (respawnArray.indexOf(JSON.stringify(respawn_pos)) == -1) {
        player.message("New Remnant Spawn Discovered")
        respawnArray = JSON.parse(respawnArray)
        respawnArray.push(respawn_pos)
        respawnArray = JSON.stringify(respawnArray)
        player.storeddata.put("respawnArray", respawnArray)
    }

}
